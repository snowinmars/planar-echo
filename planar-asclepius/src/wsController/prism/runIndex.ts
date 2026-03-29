import runPrismScript from '@/shared/runPrismScript.js';

import type { WebSocket } from 'ws';
import type { PrismIndexStartMessage } from '@planar/shared';

const runPrismIndex = (ws: WebSocket, data: PrismIndexStartMessage['data']) => {
  return runPrismScript('index.js', data)
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
