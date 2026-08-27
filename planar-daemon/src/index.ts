import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { boot } from './boot.js';
import { send } from './shared/send.js';

import type { ToDaemon } from '@planar/kernel';
import { nothing, type Maybe } from '@planar/shared';

const isIpc = !!process.send;

const defaultGhostDir = (): string => join(
  dirname(fileURLToPath(import.meta.url)), '..', '..', 'planar-ghost', // TODO [snow]: PATHES
);

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
  const ghostDir = process.argv[2] ?? defaultGhostDir();
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
