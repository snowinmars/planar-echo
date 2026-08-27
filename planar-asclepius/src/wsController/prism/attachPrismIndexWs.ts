import { WebSocketServer, WebSocket } from 'ws';
import { runPrismIndex } from './runIndex.js';
import logger from '@/shared/logger.js';

import type {
  PrismIndexStartMessage,
  PrismIndexProgressMessage,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
  SafeError,
} from '@planar/shared';

type Message = PrismIndexStartMessage | PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage;

export const attachPrismIndexWs = (wss: WebSocketServer): void => {
  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'ready' }));

    ws.on('message', (json: string) => {
      let msg: Message;
      try {
        msg = JSON.parse(json) as Message;
      }
      catch (e: unknown) {
        const err = e as SafeError;
        logger.error(err);

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'error', data: err.toString ? err.toString() : err }));
        }
        else {
          logger.warn(`Cannot send error websocket message because its state it '${ws.readyState}'`);
        }

        return;
      }

      if (msg.type === 'start') {
        const startMessage = msg;

        if (!startMessage.data) {
          logger.warn('data cannot be empty');
          return;
        }
        if (!startMessage.data.weiduExeDir) {
          logger.warn('data.weiduExeDir cannot be empty');
          return;
        }
        if (!startMessage.data.chitinKeyFile) {
          logger.warn('data.chitinKeyFile cannot be empty');
          return;
        }
        if (!startMessage.data.ghostDir) {
          logger.warn('data.ghostDir cannot be empty');
          return;
        }
        if (!startMessage.data.prismDir) {
          logger.warn('data.prismDir cannot be empty');
          return;
        }
        if (!startMessage.data.gameLanguage) {
          logger.warn('data.gameLanguage cannot be empty');
          return;
        }
        if (!startMessage.data.gameName) {
          logger.warn('data.gameName cannot be empty');
          return;
        }

        runPrismIndex(ws, startMessage.data);
      }
    });
  });
};
