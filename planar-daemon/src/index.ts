import { just, nothing } from '@planar/shared';

import { boot } from './boot.js';
import { send } from './shared/send.js';

import type { Maybe, ToDaemon } from '@planar/shared';

const isIpc = !!process.send;

let live: Maybe<(msg: ToDaemon) => void> = nothing();

if (isIpc) {
  process.on('message', (msg: ToDaemon) => {
    if (live) return live(msg);

    if (msg.type !== 'start') return;

    const ghostDir = msg.data.ghostDir;
    const modsDir = msg.data.modsDir;
    const areId = msg.data.are;
    const entranceId = msg.data.entrance;

    boot(ghostDir, modsDir, areId, entranceId)
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
  const modsDir = just(process.argv[3]);
  const areId = process.argv[4];
  const entranceId = process.argv[5];

  boot(ghostDir, modsDir, areId, entranceId)
    .then((x) => {
      live = x;
    })
    .catch((err: unknown) => {
      send({ type: 'error', message: err instanceof Error ? err.message : String(err) });
      process.exitCode = 1;
    });
}
