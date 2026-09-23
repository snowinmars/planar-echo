import { fileExists } from '@planar/shared/node';

import { ghostJs, loadGhostJs } from './shared.js';

import type { GhostAre } from '@planar/shared';

export const loadGhostAre = async (ghostDir: string, areId: string): Promise<GhostAre> => {
  const arePath = ghostJs(ghostDir, 'are', `${areId}`);

  const areOk = await fileExists(arePath);
  if (!areOk) throw new Error(`Trying to load unexisting are '${arePath}'`);

  return loadGhostJs<GhostAre>(arePath);
};
