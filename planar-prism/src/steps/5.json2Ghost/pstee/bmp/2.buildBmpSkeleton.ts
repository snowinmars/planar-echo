import { isGhostBmpV1 } from '@/steps/4.biffs2json/pstee/bmp/index.js';

import { buildBmpSkeletonV1 } from './v1/buildBmpSkeletonV1.js';
import { buildBmpSkeletonV5 } from './v5/buildBmpSkeletonV5.js';

import type { GhostBmp } from '@planar/shared';

export const buildBmpSkeleton = (bmp: GhostBmp): string => {
  if (isGhostBmpV1(bmp)) return buildBmpSkeletonV1(bmp);
  return buildBmpSkeletonV5(bmp);
};
