import { json2GhostPstee } from './pstee/json2GhostPstee.js';

import type { Pathes } from '../1.createPathes/types.js';
import type { AllPsteeJsons } from '../4.biffs2json/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const json2Ghost = async (
  allJsons: AllJsons,
  pathes: Pathes,
  discover: DiscoverNext,
): Promise<void> => {
  switch (pathes.gameName) {
    case 'pstee':
      return json2GhostPstee(allJsons, pathes, discover);
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
