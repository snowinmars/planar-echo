import { json2GhostPstee } from './pstee/json2GhostPstee.js';

import type { Paths } from '../1.createPaths/types.js';
import type { AllPsteeJsons } from '../4.biffs2json/types.js';
import type { DiscoverNext } from '@/discoverer.types.js';

type AllJsons = AllPsteeJsons; // extend with new games

export const json2Ghost = async (
  allJsons: AllJsons,
  paths: Paths,
  discover: DiscoverNext,
): Promise<void> => {
  switch (paths.gameName) {
    case 'pstee':
      return json2GhostPstee(allJsons, paths, discover);
    case 'bg1ee':
    case 'bg2ee':
    case 'iwdee':
    case 'iwd2':
      throw new Error(`${paths.gameName} is unsupported by now, you can be the one who change it`);
  }
};
