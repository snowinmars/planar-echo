import { exec } from 'child_process';
import { concat, Observable } from 'rxjs';
import { WebSocket } from 'ws';

import logger from '@/shared/logger.js';
import { runPrismScript } from '@/shared/runPrismScript.js';

import type {
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
  PrismIndexProgressMessage,
  PrismIndexStartMessage,
  Progress,
  ProgressStep,
} from '@planar/shared';

type PrismIndexResponseData = PrismIndexProgressMessage['data'] | PrismIndexErrorMessage['data'];

export const runCommand = (command: string, step: ProgressStep): Observable<PrismIndexProgressMessage['data']> => {
  return new Observable((subscriber) => {
    const message: PrismIndexProgressMessage['data'] = {
      value: 1,
      step,
      params: {
        rssBytes: process.memoryUsage().rss,
      },
    } as Progress; // TODO [snow]: hot to drop cast?
    subscriber.next(message);

    logger.debug(command);
    const childProcess = exec(command, (error) => {
      if (error) {
        subscriber.error(error);
        return;
      }

      const message: PrismIndexProgressMessage['data'] = {
        value: 100,
        step,
        params: {
          rssBytes: process.memoryUsage().rss,
        },
      } as Progress; // TODO [snow]: hot to drop cast?
      subscriber.next(message);

      subscriber.complete();
    });

    return () => {
      if (!childProcess.killed) {
        childProcess.kill();
      }
    };
  });
};

const run = (data: PrismIndexStartMessage['data']): Observable<PrismIndexResponseData> => {
  // TODO [snow]: these lines are now the only lines that requires yarn as a runtime dependency
  // It is possible to run these commands through pure node. Do it
  const obs0 = runCommand(`yarn workspace @planar/prism build`, 'buildPrism'); // TODO [snow]: use dir from args
  const obs1 = runPrismScript(data.prismDir, 'index.js', data);
  const obs2 = runCommand(`yarn workspace @planar/prism build-ghost`, 'buildGhost'); // TODO [snow]: use dir from args
  logger.info('Done');

  return concat(obs0, obs1, obs2);
};

export const runPrismIndex = (ws: WebSocket, data: PrismIndexStartMessage['data']) => {
  return run(data)
    .subscribe({
      next: (data) => {
        const d = data as PrismIndexProgressMessage['data']; // TODO [snow]: errors will go to error callback, but typing here is broken
        if (ws.readyState === WebSocket.OPEN) {
          const message: PrismIndexProgressMessage = { type: 'progress', data: d };
          ws.send(JSON.stringify(message));
        }
        else {
          logger.warn(`Cannot send next websocket message because its state it '${ws.readyState}'`);
        }
      },
      error: (err: PrismIndexErrorMessage['data']) => {
        if (ws.readyState === WebSocket.OPEN) {
          const message: PrismIndexErrorMessage = { type: 'error', data: err.toString ? err.toString() : err };
          ws.send(JSON.stringify(message));
        }
        else {
          logger.warn(`Cannot send error websocket message because its state it '${ws.readyState}'`);
        }
      },
      complete: () => {
        if (ws.readyState === WebSocket.OPEN) {
          const message: PrismIndexCompleteMessage = { type: 'complete', data: '' };
          ws.send(JSON.stringify(message));
        }
        else {
          logger.warn(`Cannot send complete websocket message because its state it '${ws.readyState}'`);
        }
      },
    });
};
