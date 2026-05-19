import biffs2jsonPstee from './pstee/biff2jsonPstee.js';

import type { Pathes } from '../1.createPathes/index.js';
import type { DecompiledBiff, DecompiledBiffType } from '../3.decompileBiffs/index.js';
import type { AllPsteeJsons } from './types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const biffs2json = async (
  decompiledBiffs: Map<DecompiledBiffType, DecompiledBiff[]>,
  pathes: Pathes,
): Promise<AllJsons> => {
  switch (pathes.gameName) {
    case 'pstee':
      return biffs2jsonPstee(decompiledBiffs, pathes);
    case 'bg1ee':
    case 'bg2ee':
    case 'iwdee':
    case 'iwd2ee':
      throw new Error(`${pathes.gameName} is unsupported by now, you can be the one who change it`);
    case 'bg1':
    case 'bg2':
    case 'iwd':
    case 'iwd2':
    case 'pst':
      throw new Error(`${pathes.gameName} will not be supported, because there are EE version of the same game`);
  }
};
