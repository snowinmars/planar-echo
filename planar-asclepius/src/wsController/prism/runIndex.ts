import runPrismScript from '@/shared/runPrismScript.js';
import { concat, Observable } from 'rxjs';
import { exec } from 'child_process';

import type { WebSocket } from 'ws';
import type { PrismIndexCompleteMessage, PrismIndexErrorMessage, PrismIndexProgressMessage, PrismIndexStartMessage, ProgressStep } from '@planar/shared';

type PrismIndexResponseData = PrismIndexProgressMessage['data'] | PrismIndexErrorMessage['data'];

export const runCommand = (command: string, step: ProgressStep): Observable<PrismIndexProgressMessage['data']> => {
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

const run = (data: PrismIndexStartMessage['data']): Observable<PrismIndexResponseData> => {
  // TODO [snow]: these lines are now the only lines that requires yarn as a runtime dependency
  // It is possible to run these commands through pure node. Do it
  const obs0 = runCommand(`yarn workspace @planar/prism build`, 'buildPrism'); // TODO [snow]: use dir from args
  const obs1 = runPrismScript(data.prismDir, 'index.js', data);
  const obs2 = runCommand(`yarn workspace @planar/prism build-ghost`, 'dlg_json2ghost_build'); // TODO [snow]: use dir from args

  return concat(obs0, obs1, obs2);
};

const runPrismIndex = (ws: WebSocket, data: PrismIndexStartMessage['data']) => {
  return run(data)
    .subscribe({
      next: (data) => {
        const d = data as PrismIndexProgressMessage['data']; // TODO [snow]: errors will go to error callback, but typing here is broken
        if (ws.readyState === 1) {
          const message: PrismIndexProgressMessage = { type: 'progress', data: d };
          ws.send(JSON.stringify(message));
        }
        else {
          console.warn(`Cannot send next websocket message because its state it ${ws.readyState}`);
        }
      },
      error: (err: PrismIndexErrorMessage['data']) => {
        if (ws.readyState === 1) {
          const message: PrismIndexErrorMessage = { type: 'error', data: err.toString ? err.toString() : err };
          ws.send(JSON.stringify(message));
        }
        else {
          console.warn(`Cannot send error websocket message because its state it ${ws.readyState}`);
        }
      },
      complete: () => {
        if (ws.readyState === 1) {
          const message: PrismIndexCompleteMessage = { type: 'complete' };
          ws.send(JSON.stringify(message));
        }
        else {
          console.warn(`Cannot send complete websocket message because its state it ${ws.readyState}`);
        }
      },
    });
};

export default runPrismIndex;
