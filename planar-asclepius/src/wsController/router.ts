import { WebSocketServer } from 'ws';
import runPrismIndex from '../wsController/prism/runIndex.js';

import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { WebSocket } from 'ws';
import type {
  PrismIndexStartMessage,
  PrismIndexProgressMessage,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
  SafeError,
} from '@planar/shared';

type Message = PrismIndexStartMessage | PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage;

const createPrismIndexWsEndpoint = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const wss = new WebSocketServer({ server, path: '/api/prism/index' });

  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'ready' }));

    ws.on('message', (json: string) => {
      let msg: Message;
      try {
        msg = JSON.parse(json) as Message;
      }
      catch (e: unknown) {
        const err = e as SafeError;
        console.error(err);

        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'error', err: err.toString ? err.toString() : err }));
        }
        else {
          console.warn(`Cannot send error websocket message because its state it ${ws.readyState}`);
        }

        return;
      }

      if (msg.type === 'start') {
        const startMessage = msg;

        if (!startMessage.data) {
          console.warn('data cannot be empty');
          return;
        }
        if (!startMessage.data.weiduExeDir) {
          console.warn('data.weiduExeDir cannot be empty');
          return;
        }
        if (!startMessage.data.chitinKeyFile) {
          console.warn('data.chitinKeyFile cannot be empty');
          return;
        }
        if (!startMessage.data.ghostDir) {
          console.warn('data.ghostDir cannot be empty');
          return;
        }
        if (!startMessage.data.prismDir) {
          console.warn('data.prismDir cannot be empty');
          return;
        }
        if (!startMessage.data.gameLanguage) {
          console.warn('data.gameLanguage cannot be empty');
          return;
        }
        if (!startMessage.data.gameName) {
          console.warn('data.gameName cannot be empty');
          return;
        }

        runPrismIndex(ws, startMessage.data);
      }
    });
  });
};

const createWsRouter = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  createPrismIndexWsEndpoint(server);
};

export default createWsRouter;
