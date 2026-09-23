import { fileExists } from '@planar/shared/node';

import { ghostJs, loadGhostJs } from './shared.js';

import type { GhostCre } from '@planar/shared';

export const loadGhostCre = async (ghostDir: string, cre: string): Promise<GhostCre> => {
  const crePath = ghostJs(ghostDir, 'cre', `${cre}.cre`);

  const creOk = await fileExists(crePath);
  if (!creOk) throw new Error(`Trying to load unexisting cre '${crePath}'`);

  return loadGhostJs<GhostCre>(crePath);
};
