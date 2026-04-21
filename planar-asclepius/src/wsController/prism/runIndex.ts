import { join } from 'path';
import runPrismScript from '@/shared/runPrismScript.js';
import { concat, Observable } from 'rxjs';
import { exec } from 'child_process';
import { prismDir } from '../../shared/folders.js';
import { from } from 'rxjs';

import type { WebSocket } from 'ws';
import type { PrismIndexProgressMessage, PrismIndexStartMessage, ProgressStep } from '@planar/shared';

export const runYarnCommand = (command: string, step: ProgressStep): Observable<PrismIndexProgressMessage['data']> => {
  return new Observable((subscriber) => {
    const message: PrismIndexProgressMessage['data'] = {
      value: 1,
      step,
    };
    subscriber.next(message);

    const childProcess = exec(command, (error) => {
      if (error) {
        subscriber.error(error);
        return;
      }

      const message: PrismIndexProgressMessage['data'] = {
        value: 100,
        step,
      };
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

const run = (data: PrismIndexStartMessage['data']) => {
  const obs0 = runYarnCommand(`yarn --cwd ${prismDir} compile`, 'compilePrism'); // TODO [snow]: use dir from args

  const obs1 = runPrismScript('index.js', data);

  const obs2 = runYarnCommand(`yarn --cwd ${prismDir} compile-ghost`, 'dlg_json2ghost_compilation'); // TODO [snow]: use dir from args

  return concat(obs0, obs1, obs2);
};

const runPrismIndex = (ws: WebSocket, data: PrismIndexStartMessage['data']) => {
  return run(data)
    .subscribe({
      next: (data) => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'progress', data }));
        }
        else {
          console.warn(`Cannot send next websocket message because its state it ${ws.readyState}`);
        }
      },
      error: (err: { toString: (() => void) | undefined }) => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'error', err: err.toString ? err.toString() : err }));
        }
        else {
          console.warn(`Cannot send error websocket message because its state it ${ws.readyState}`);
        }
      },
      complete: () => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'complete' }));
        }
        else {
          console.warn(`Cannot send complete websocket message because its state it ${ws.readyState}`);
        }
      },
    });
};

export default runPrismIndex;
