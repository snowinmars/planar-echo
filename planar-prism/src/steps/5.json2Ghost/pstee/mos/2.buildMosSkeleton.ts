import { isGhostMosV1 } from '@/steps/4.biffs2json/pstee/mos/isMosV1.js';

import { buildMosSkeletonV1 } from './v1/buildMosSkeletonV1.js';
import { buildMosSkeletonV2 } from './v2/buildMosSkeletonV2.js';

import type { GhostMos } from '@planar/shared';

export const buildMosSkeleton = (mos: GhostMos): string => {
  if (isGhostMosV1(mos)) return buildMosSkeletonV1(mos);
  else return buildMosSkeletonV2(mos);
};
