import { fileExists } from '@planar/shared/node';

import { ghostJs, loadGhostJs } from './shared.js';

import type { GhostIniAnimation } from '@planar/shared';

export const loadGhostAnimation = async (ghostDir: string, hex4: string): Promise<GhostIniAnimation> => {
  const animationPath = ghostJs(ghostDir, 'ini', `${hex4}.ini`);

  const ok = await fileExists(animationPath);
  if (!ok) throw new Error(`Trying to load unexisting animation '${animationPath}'`);

  return loadGhostJs<GhostIniAnimation>(animationPath);
};
