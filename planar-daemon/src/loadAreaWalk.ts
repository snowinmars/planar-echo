import { readFile } from 'fs/promises';
import { join } from 'path';
import { createWorld, DEFAULT_ARE } from '@planar/kernel';
import { evalGhostFactory, nothing } from '@planar/shared';

import type { World } from '@planar/kernel';
import type { GhostAre, Maybe } from '@planar/shared';

export const loadAreaWalk = async (
  ghostDir: string,
  are: string = DEFAULT_ARE,
  entrance: Maybe<string> = nothing(),
): Promise<World> => {
  const areId = are.trim();
  const src = await readFile(join(ghostDir, 'ghost', 'are', 'dist', `${areId}.js`), 'utf8');
  const ghostAre = evalGhostFactory<GhostAre>(src)();
  if (!ghostAre.walk) {
    throw new Error(`${areId}: no walk`);
  }
  const bin = await readFile(join(ghostDir, 'assets', 'are', ghostAre.walk.walkBinName));
  return createWorld(ghostAre, new Uint8Array(bin), entrance);
};
