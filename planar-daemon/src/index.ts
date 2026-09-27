import { randomUUID } from 'node:crypto';

import { SessionHost } from './host.js';

import type { DaemonInbound, DaemonOutbound, SessionFrame } from '@planar/shared';

const TICK_MS = 50;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const send = (message: DaemonOutbound): void => {
  if (!process.send) throw new Error('Daemon has no IPC channel');
  process.send(message);
};

const fail = (message: string): void => {
  send({ type: 'fatal', message });
  process.exitCode = 1;
};

const main = (): void => {
  if (!process.send) {
    console.error('The session daemon is an IPC worker. Start it through Asclepius.');
    process.exitCode = 1;
    return;
  }

  let host: SessionHost | null = null;
  let timer: NodeJS.Timeout | null = null;
  let ticking = false;

  const stop = (): void => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const tick = (): void => {
    if (!host || ticking) return;
    ticking = true;
    try {
      const frame = host.tick();
      if (frame.type !== 'replication') return;
      for (const delivery of host.project(frame)) {
        send({ type: 'deliver', connectionId: delivery.connectionId, frame: delivery.frame });
      }
    }
    catch (error: unknown) {
      stop();
      fail(error instanceof Error ? error.message : 'tick failed');
    }
    finally {
      ticking = false;
    }
  };

  process.on('message', (raw: unknown) => {
    void onMessage(raw).catch((error: unknown) => {
      stop();
      fail(error instanceof Error ? error.message : 'daemon message failed');
    });
  });

  const onMessage = async (raw: unknown): Promise<void> => {
    if (!isRecord(raw) || typeof raw.type !== 'string') throw new Error('Malformed IPC message');
    const message = raw as DaemonInbound;
    switch (message.type) {
      case 'boot': {
        if (host) throw new Error('Session is already booted');
        host = new SessionHost(randomUUID(), message.lock);
        await host.loadServer(message.serverModuleUrl);
        timer = setInterval(tick, TICK_MS);
        send({ type: 'ready', sessionId: host.sessionId, lockHash: host.lockHash });
        return;
      }
      case 'join': {
        if (!host) throw new Error('Session is not booted');
        const joined = host.join(message.connectionId, message.principalId, message.lockHash);
        const frame: SessionFrame = joined.ok
          ? joined.frame
          : { type: 'reject', reason: joined.reason };
        send({ type: 'deliver', connectionId: message.connectionId, frame });
        return;
      }
      case 'command': {
        if (!host) throw new Error('Session is not booted');
        const reason = host.admit(
          message.connectionId,
          message.commandWireId,
          message.connectionEpoch,
          message.payload,
        );
        if (reason) {
          send({
            type: 'deliver',
            connectionId: message.connectionId,
            frame: { type: 'reject', reason },
          });
        }
        return;
      }
      case 'leave': {
        host?.leave(message.connectionId);
        return;
      }
      case 'shutdown': {
        stop();
        process.exit(0);
        return;
      }
      default: {
        const unknown: never = message;
        throw new Error(`Unknown IPC message ${JSON.stringify(unknown)}`);
      }
    }
  };
};

main();
