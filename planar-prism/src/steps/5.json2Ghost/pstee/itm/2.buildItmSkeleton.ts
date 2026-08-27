import { isGhostItmV10 } from '@/steps/4.biffs2json/pstee/itm/isItmV1.js';
import { buildItmSkeletonV10 } from './v10/buildItmSkeletonV10.js';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { GhostItm } from '@planar/shared';

export const buildItmSkeleton = (itm: GhostItm, discover: DiscoverNext): string => {
  if (isGhostItmV10(itm)) return buildItmSkeletonV10(itm, discover);
  throw new Error(`Itm header version is out of range`);
};
