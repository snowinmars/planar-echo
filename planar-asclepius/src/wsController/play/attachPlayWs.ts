import { WebSocket } from 'ws';
import logger from '@/shared/logger.js';
import { spawnDaemon } from '@/shared/spawnDaemon.js';

import type { ChildProcess, Serializable } from 'child_process';
import type { WebSocketServer } from 'ws';

type Session = {
  child: ChildProcess;
  clients: Set<WebSocket>;
  syncRequired: boolean;
  onMessage: (msg: unknown) => void;
  onError: (err: Error) => void;
  onExit: () => void;
};

type State
  = | { tag: 'idle' }
    | { tag: 'live'; session: Session }
    | { tag: 'dying'; child: ChildProcess; joiningWs: Set<WebSocket> };

const isWsAttachable = (ws: WebSocket): boolean => {
  const attachable = ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING;
  return attachable;
};

export const attachPlayWs = (getGhostDir: () => string, wss: WebSocketServer): void => {
  let state: State = { tag: 'idle' };

  const broadcastTo = (target: Session, payload: unknown): void => {
    const json = JSON.stringify(payload);

    for (const client of target.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    }
  };

  const finishDying = (): void => {
    if (state.tag !== 'dying') return;

    const joining = [...state.joiningWs];
    state.joiningWs.clear();

    const attachable = joining.filter(isWsAttachable); // TODO [snow]: I do think, that I can just stop and drop everything, if I want to kill the daemon
    const nobodyWaiting = attachable.length === 0;
    if (nobodyWaiting) {
      state = { tag: 'idle' };
      return;
    }

    const session = spawnFresh();
    state = { tag: 'live', session };
    for (const ws of attachable) {
      attachClient(ws, session);
    }
  };

  const onChildExit = (session: Session): void => {
    session.child.off('message', session.onMessage);
    session.child.off('error', session.onError);
    session.child.off('exit', session.onExit);

    const crashed = state.tag === 'live' && state.session === session;
    if (crashed) {
      state = { tag: 'idle' };
      for (const ws of session.clients) ws.close();
      session.clients.clear();
      return;
    }

    const dyingThis = state.tag === 'dying' && state.child === session.child;
    if (dyingThis) {
      finishDying();
    }
  };

  const beginDie = (target: Session): void => {
    target.child.off('message', target.onMessage);
    target.child.off('error', target.onError);

    state = { tag: 'dying', child: target.child, joiningWs: new Set<WebSocket>() };

    const alreadyExited = target.child.exitCode !== null || target.child.signalCode !== null;
    if (alreadyExited) {
      target.child.off('exit', target.onExit);
      finishDying();
      return;
    }

    if (!target.child.killed) {
      target.child.kill();
    }
  };

  const spawnFresh = (): Session => {
    const child = spawnDaemon(getGhostDir());

    const session: Session = {
      child,
      clients: new Set<WebSocket>(),
      syncRequired: false, // at least one message was delivered
      onMessage: (msg: unknown): void => {
        session.syncRequired = true;
        broadcastTo(session, msg);
      },
      onError: (err: Error): void => {
        logger.error(err);
      },
      onExit: (): void => {
        onChildExit(session);
      },
    };

    child.on('message', session.onMessage);
    child.on('error', session.onError);
    child.on('exit', session.onExit);

    return session;
  };

  const attachClient = (ws: WebSocket, target: Session): void => {
    target.clients.add(ws);

    if (target.syncRequired) target.child.send({ type: 'sync' });

    ws.on('message', (raw: Buffer) => {
      const msg: unknown = JSON.parse(raw.toString());

      if (target.child.connected) target.child.send(msg as Serializable);
      // else throw error to websocket, that world is dead
    });

    ws.on('close', () => {
      logger.info(`close websocket for session`);

      target.clients.delete(ws);

      const lastOfThisLive = state.tag === 'live'
        && state.session === target
        && target.clients.size === 0;
      if (lastOfThisLive) {
        beginDie(target);
      }
    });
  };

  const queueJoiningWs = (ws: WebSocket): void => {
    if (state.tag !== 'dying') throw new Error('Impossible');

    state.joiningWs.add(ws);
    ws.on('close', () => {
      if (state.tag !== 'dying') return;
      state.joiningWs.delete(ws);
    });
  };

  wss.on('connection', (ws: WebSocket) => {
    const tag = state.tag;
    switch (tag) {
      case 'idle': {
        const session = spawnFresh();
        state = { tag: 'live', session };
        attachClient(ws, session);
        break;
      }
      case 'live': {
        attachClient(ws, state.session);
        break;
      }
      case 'dying': {
        queueJoiningWs(ws);
        break;
      }
      default: throw new Error(`State tag '${tag}' is out of range`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
    }
  });
};
