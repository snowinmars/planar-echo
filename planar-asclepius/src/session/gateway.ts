import { fork } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolveModpack } from '@planar/shared';

import logger from '@/shared/logger.js';

import type { ChildProcess } from 'node:child_process';

import type { WebSocket } from 'ws';

import type { DaemonInbound, DaemonOutbound, FrozenLock, ModContract, ModpackManifest, SessionFrame } from '@planar/shared';

const require = createRequire(import.meta.url);

const messageText = (data: unknown): string => {
  if (typeof data === 'string') return data;
  if (Buffer.isBuffer(data)) return data.toString('utf8');
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString('utf8');
  if (Array.isArray(data) && data.every(chunk => Buffer.isBuffer(chunk))) {
    return Buffer.concat(data).toString('utf8');
  }
  throw new Error('Session frame is not text');
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

type SocketState = {
  id: string;
  socket: WebSocket;
  epoch: number | null;
};

export class SessionGateway {
  private child: ChildProcess | null = null;
  private lock: FrozenLock | null = null;
  private ready = false;
  private readonly sockets = new Map<string, SocketState>();
  private stopping = false;

  public get lockHash(): string {
    if (!this.lock) throw new Error('Session lock is not resolved');
    return this.lock.lockHash;
  }

  public async start(): Promise<void> {
    const conformanceDir = dirname(require.resolve('@planar/mods/conformance/contract'));
    const contractUrl = join(conformanceDir, 'contract.js');
    const serverModuleUrl = join(conformanceDir, 'server.js');
    const loaded: unknown = await import(pathToFileURL(contractUrl).href);
    if (!isRecord(loaded)) throw new Error('Conformance contract module is empty');
    const manifest = loaded.conformanceManifest as ModpackManifest;
    const contract = loaded.conformanceContract as ModContract;
    this.lock = resolveModpack({ manifest, contracts: [contract] });
    const daemonEntry = require.resolve('@planar/daemon');
    const child = fork(daemonEntry, [], {
      stdio: ['ignore', 'inherit', 'inherit', 'ipc'],
    });
    this.child = child;
    child.on('exit', (code) => {
      if (this.stopping) return;
      this.failAll(`daemon exited (${code ?? 'null'})`);
    });
    const ready = new Promise<void>((resolve, reject) => {
      let settled = false;
      const finish = (error?: Error): void => {
        if (settled) return;
        settled = true;
        if (error) reject(error);
        else resolve();
      };
      const onMessage = (message: DaemonOutbound): void => {
        if (message.type === 'ready') {
          this.ready = true;
          finish();
          return;
        }
        if (message.type === 'fatal') {
          this.failAll(message.message);
          finish(new Error(message.message));
          return;
        }
        this.onDaemon(message);
      };
      child.on('message', onMessage);
      child.on('error', error => finish(error));
    });
    this.sendDaemon({ type: 'boot', lock: this.lock, serverModuleUrl });
    await ready;
    logger.info(`Session ${this.lock.lockHash} is authoritative`);
  }

  public stop(): void {
    this.stopping = true;
    if (this.child && !this.child.killed) {
      this.sendDaemon({ type: 'shutdown' });
      this.child.kill();
    }
    this.child = null;
    for (const state of this.sockets.values()) state.socket.close();
    this.sockets.clear();
  }

  public attach(socket: WebSocket): void {
    if (!this.lock || !this.ready) {
      socket.close(1013, 'session is not ready');
      return;
    }
    const id = randomUUID();
    const state: SocketState = { id, socket, epoch: null };
    this.sockets.set(id, state);
    const move = this.lock.commands.find(command => command.key === 'planar.conformance/move@1');
    if (!move) {
      socket.close(1011, 'move command missing');
      return;
    }
    this.send(socket, {
      type: 'offer',
      lockHash: this.lock.lockHash,
      moveWireId: move.wireId,
      seats: this.lock.seats.map(seat => seat.principalId),
    });
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
    if (!isRecord(parsed) || typeof parsed.type !== 'string') throw new Error('Malformed client frame');
    if (parsed.type === 'hello') {
      if (typeof parsed.principalId !== 'string' || typeof parsed.lockHash !== 'string') {
        throw new Error('Malformed hello');
      }
      this.sendDaemon({
        type: 'join',
        connectionId: state.id,
        principalId: parsed.principalId,
        lockHash: parsed.lockHash,
      });
      return;
    }
    if (parsed.type === 'command') {
      if (typeof parsed.commandWireId !== 'number' || typeof parsed.connectionEpoch !== 'number') {
        throw new Error('Malformed command');
      }
      this.sendDaemon({
        type: 'command',
        connectionId: state.id,
        commandWireId: parsed.commandWireId,
        connectionEpoch: parsed.connectionEpoch,
        payload: parsed.payload,
      });
      return;
    }
    throw new Error(`Unknown client frame ${parsed.type}`);
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
        if (message.frame.type === 'welcome') state.epoch = message.frame.connectionEpoch;
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
    this.child?.send(message);
  }

  private failAll(reason: string): void {
    for (const state of this.sockets.values()) {
      this.send(state.socket, { type: 'bye', reason });
      state.socket.close();
    }
    this.ready = false;
  }
}
