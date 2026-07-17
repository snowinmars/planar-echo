import biffs2jsonPstee from './pstee/biff2jsonPstee.js';

import type { Paths } from '../1.createPaths/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { AllPsteeJsons } from './types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const biffs2json = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  paths: Paths,
): Promise<AllJsons> => {
  switch (paths.gameName) {
    case 'pstee':
      return biffs2jsonPstee(decompiledBiffs, paths);
    case 'bg1ee':
    case 'bg2ee':
    case 'iwdee':
    case 'iwd2':
      throw new Error(`${paths.gameName} is unsupported by now, you can be the one who change it`);
  }
};
