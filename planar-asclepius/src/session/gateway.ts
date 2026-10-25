import { fork } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import { readModCatalog } from '@planar/mods/catalog';
import { manifest } from '@planar/mods/modpack';
import { isNothing, isRecord, nothing, resolveModpack } from '@planar/shared';

import logger from '@/shared/logger.js';

import type { ChildProcess } from 'node:child_process';

import type { WebSocket } from 'ws';

import type {
  ClientAnnouncedSessionLock,
  ClientCommand,
  DaemonInbound,
  DaemonOutbound,
  FrozenLock,
  Maybe,
  ModContract,
  SessionFrame,
  SessionFrame_AnnounceSessionLock
} from '@planar/shared';

const require = createRequire(import.meta.url);

const WS_TRY_AGAIN_LATER = 1013;

const messageText = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (Buffer.isBuffer(data)) return data.toString('utf8');
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString('utf8');
  if (Array.isArray(data) && data.every(chunk => Buffer.isBuffer(chunk))) {
    return Buffer.concat(data).toString('utf8');
  }
  throw new Error('Session frame is not text');
};

type SocketState = {
  id: string;
  socket: WebSocket;
  epoch: number | null;
};

const parsedIsClientAnnouncedSessionLock = (parsed: unknown): parsed is ClientAnnouncedSessionLock => {
  if (!isRecord(parsed) || typeof parsed.type !== 'string') return false;
  // TODO [snow]: add zod validation?
  return parsed.type === 'announcedSessionLock';
}
const parsedIsClientCommand = (parsed: unknown): parsed is ClientCommand => {
  if (!isRecord(parsed) || typeof parsed.type !== 'string') return false;
  // TODO [snow]: add zod validation?
  return parsed.type === 'command';
}

const loadContract = async (specifier: string): Promise<ModContract> => {
  const loaded: unknown = await import(specifier);
  // TODO [snow]: add zod?
  if (!isRecord(loaded) || !loaded.contract) throw new Error(`Mod contract module '${specifier}' has no contract export`);

  return loaded.contract as ModContract;
};

export class SessionGateway {
  private daemonChild: Maybe<ChildProcess> = nothing();
  private modpackLock: Maybe<FrozenLock> = nothing();
  private ready = false;
  private sockets = new Map<string, SocketState>();

  public get lockHash(): string {
    if (isNothing(this.modpackLock)) throw new Error('Modpack lock is not resolved for this session');
    return this.modpackLock.lockHash;
  }

  public async start(): Promise<void> {
    const descriptors = readModCatalog();

    const loaded: { contract: ModContract; serverSpecifier: string }[] = [];
    for (const descriptor of descriptors) {
      loaded.push({
        contract: await loadContract(descriptor.contractSpecifier),
        serverSpecifier: descriptor.serverSpecifier,
      });
    }

    this.modpackLock = resolveModpack({ manifest, contracts: loaded.map(entry => entry.contract) });;

    const serverModuleUrls = this.modpackLock.mods.map((mod) => {
      const loadedMod = loaded.find(x => x.contract.id === mod.id)!;
      return import.meta.resolve(loadedMod.serverSpecifier);
    });

    const daemonEntry = require.resolve('@planar/daemon');
    this.daemonChild = fork(daemonEntry, [], {
      stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
    });
    this.daemonChild.on('exit', (code) => {
      this.failAll(`daemon exited (${code ?? 'null'})`);
    });

    const waitForReadyFromDaemon = new Promise<void>((resolve, reject) => {
      const awaited = (error: Maybe<Error> = nothing()): void => {
        if (error) reject(error);
        else resolve();
      };

      const onMessage = (message: DaemonOutbound): void => {
        const t = message.type;

        switch (t) {
          case 'ready': {
            this.ready = true;
            awaited();
            break;
          }
          case 'fatal': {
            this.failAll(message.message);
            awaited(new Error(message.message));
            break;
          }
          case 'deliver':
          case 'broadcast': {
            this.onDaemon(message);
            break;
          }
          default: throw new Error(`Unknown daemon message type '${t}'`);
        }
      };

      this.daemonChild?.on('message', onMessage);
      this.daemonChild?.on('error', error => awaited(error));
    });

    this.sendDaemon({ type: 'boot', lock: this.modpackLock, serverModuleUrls });

    await waitForReadyFromDaemon;

    logger.info(`Session ${this.modpackLock.lockHash} is authoritative`);
  }

  public stop(): void {
    this.ready = false;

    if (this.daemonChild && !this.daemonChild.killed) {
      this.sendDaemon({ type: 'shutdown' });
      this.daemonChild.kill(); // TODO [snow]: maybe not a best idea to kill after shutdown
    }

    this.daemonChild = nothing();

    for (const state of this.sockets.values()) state.socket.close();
    this.sockets.clear();
  }

  public attach(socket: WebSocket): void {
    if (!this.ready) {
      socket.close(WS_TRY_AGAIN_LATER, 'Session is not ready');
      return;
    }

    if (!this.modpackLock) throw new Error('Modpack was not locked after gateway became ready');

    const id = randomUUID();
    const state: SocketState = { id, socket, epoch: null };
    this.sockets.set(id, state);

    const m: SessionFrame_AnnounceSessionLock = {
      type: 'announceSessionLock',
      lockHash: this.modpackLock.lockHash,
      allowedSeats: this.modpackLock.seats.map(seat => seat.principalId),
    }
    this.send(socket, m);
    socket.on('message', (data) => {
      try {
        this.onClient(state, messageText(data));
      }
      catch (error: unknown) {
        logger.error(error instanceof Error ? error.message : 'session socket failed');
        socket.close(1011, 'session socket failed');
      }
    });
    socket.on('close', () => {
      this.sockets.delete(id);
      this.sendDaemon({ type: 'leave', connectionId: id });
    });
  }

  private onClient(state: SocketState, raw: string): void {
    const parsed: unknown = JSON.parse(raw);

    const isAnnouncedSessionLock = parsedIsClientAnnouncedSessionLock(parsed);
    const isCommand = parsedIsClientCommand(parsed);

    if (isAnnouncedSessionLock) {
      this.sendDaemon({
        type: 'join',
        connectionId: state.id,
        principalId: parsed.principalId,
        lockHash: parsed.lockHash,
      });
      return;
    }

    if (isCommand) {
      this.sendDaemon({
        type: 'command',
        connectionId: state.id,
        commandId: parsed.commandId,
        connectionEpoch: parsed.connectionEpoch,
        payload: parsed.payload,
      });
      return;
    }

    throw new Error(`Unknown client frame '${parsed}'`);
  }

  private onDaemon(message: DaemonOutbound): void {
    switch (message.type) {
      case 'ready':
      case 'fatal':
        return;
      case 'broadcast':
        for (const state of this.sockets.values()) this.send(state.socket, message.frame);
        return;
      case 'deliver': {
        const state = this.sockets.get(message.connectionId);
        if (!state) return;
        if (message.frame.type === 'joinedSession') state.epoch = message.frame.connectionEpoch;
        this.send(state.socket, message.frame);
        return;
      }
      default: {
        const unknown: never = message;
        logger.error(`Unknown daemon frame ${JSON.stringify(unknown)}`);
      }
    }
  }

  private send(socket: WebSocket, frame: SessionFrame): void {
    if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(frame));
  }

  private sendDaemon(message: DaemonInbound): void {
    this.daemonChild?.send(message);
  }

  private failAll(reason: string): void {
    for (const state of this.sockets.values()) {
      this.send(state.socket, { type: 'bye', reason });
      state.socket.close();
    }
    this.ready = false;
  }
}
