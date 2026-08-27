import { WebSocket } from 'ws';
import logger from '@/shared/logger.js';
import { spawnDaemon } from '@/shared/spawnDaemon.js';
import { nothing } from '@planar/shared';

import type { ChildProcess, Serializable } from 'child_process';
import type { Maybe } from '@planar/shared';
import type { WebSocketServer } from 'ws';

type PlaySession = {
  child: ChildProcess; // daemon ipc (server)
  clients: Set<WebSocket>; // wss (pixi clients)
  ready: boolean;
};

export const attachPlayWs = (ghostDir: string, wss: WebSocketServer): void => {
  let session: Maybe<PlaySession>;

  const broadcastTo = (target: PlaySession, payload: unknown): void => {
    const json = JSON.stringify(payload);
    for (const client of target.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    }
  };

  const dropSession = (target: Maybe<PlaySession>): void => {
    if (!target) return;

    // TODO [snow]: unsub?
    // target.child.off('message', target.onMessage);
    // target.child.off('exit', target.onExit);
    // target.child.off('error', target.onError);

    if (!target.child.killed) {
      target.child.kill();
    }

    if (session === target) {
      session = nothing();
    }
  };

  const ensureSession = (ghostDir: string): PlaySession => {
    if (session) return session;

    session = {
      child: spawnDaemon(ghostDir),
      clients: new Set(),
      ready: false,
    };

    const onMessage = (msg: unknown): void => {
      if (!session) return;

      session.ready = true;
      broadcastTo(session, msg);
    };

    const onExit = (): void => {
      if (!session) return;

      session.child.off('message', onMessage);
      session.child.off('error', onError);
      session = nothing();
    };

    const onError = (err: Error): void => {
      logger.error(err);
    };

    session.child.on('message', onMessage);
    session.child.once('exit', onExit);
    session.child.on('error', onError);

    return session;
  };

  wss.on('connection', (ws: WebSocket) => {
    session = ensureSession(ghostDir);

    session.clients.add(ws);

    if (session.ready) session.child.send({ type: 'sync' });

    ws.on('message', (raw: Buffer) => {
      if (!session) return;

      const msg = JSON.parse(raw.toString());

      if (session.child.connected) {
        session.child.send(msg as Serializable);
      }
    });

    ws.on('close', () => {
      if (!session) return;

      session.clients.delete(ws);

      if (session.clients.size === 0) {
        dropSession(session);
      }
    });
  });
};
