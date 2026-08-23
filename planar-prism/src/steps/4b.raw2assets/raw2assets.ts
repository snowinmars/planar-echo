import { raw2assetsPstee } from './raw2assetsPstee.js';

import type { Paths } from '../1.createPaths/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { AllPsteeJsons } from '../4.biffs2json/types.js';

export const raw2assets = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  paths: Paths,
  allJsons: AllPsteeJsons,
): Promise<void> => {
  switch (paths.gameName) {
    case 'pstee':
      return raw2assetsPstee(allJsons, decompiledBiffs, paths);
    case 'bg1ee':
    case 'bg2ee':
    case 'iwdee':
    case 'iwd2':
      throw new Error(`'${paths.gameName}' is unsupported by now, you can be the one who change it`);
  }
};

export { raw2assetsPstee } from './raw2assetsPstee.js';
