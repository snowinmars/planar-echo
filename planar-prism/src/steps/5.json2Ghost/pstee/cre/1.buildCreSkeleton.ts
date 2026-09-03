import { isGhostCreV10 } from '@/steps/4.biffs2json/pstee/cre/isCreV1.js';

import { buildCreSkeletonV10 } from './v10/buildCreSkeletonV10.js';
import { buildCreSkeletonV11 } from './v11/buildCreSkeletonV11.js';

import type { GhostCre } from '@planar/shared';

import type { DiscoverNext } from '@/discoverer.types.js';

export const buildCreSkeleton = (cre: GhostCre, discover: DiscoverNext): string => {
  if (isGhostCreV10(cre)) return buildCreSkeletonV10(cre, discover);
  return buildCreSkeletonV11(cre, discover);
};
