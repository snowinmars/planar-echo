import { just, nothing } from '@planar/shared';

import { boot } from './boot.js';
import { send } from './shared/send.js';

import type { ToDaemon } from '@planar/kernel';
import type { Maybe } from '@planar/shared';

const isIpc = !!process.send;

let live: Maybe<(msg: ToDaemon) => void> = nothing();

if (isIpc) {
  process.on('message', (msg: ToDaemon) => {
    if (live) return live(msg);

    if (msg.type !== 'start') return;

    const ghostDir = msg.data.ghostDir;
    const areId = msg.data.are;
    const entracnceId = msg.data.entrance;

    boot(ghostDir, areId, entracnceId)
      .then((x) => {
        live = x;
      })
      .catch((err: unknown) => {
        send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
      });
  });
}
else {
  const ghostDir = just(process.argv[2]);
  const areId = process.argv[3];
  const entracnceId = process.argv[4];

  boot(ghostDir, areId, entracnceId)
    .then((x) => {
      live = x;
    })
    .catch((err: unknown) => {
      send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
      process.exitCode = 1;
    });
}
