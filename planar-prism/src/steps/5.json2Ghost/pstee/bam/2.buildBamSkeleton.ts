import { isGhostBamV1 } from '../../../4.biffs2json/pstee/bam/index.js';
import { buildBamSkeletonV1 } from './v1/buildBamSkeletonV1.js';
import { buildBamSkeletonV2 } from './v2/buildBamSkeletonV2.js';

import type { GhostBam } from '@planar/shared';

export const buildBamSkeleton = (bam: GhostBam): string => {
  if (isGhostBamV1(bam)) return buildBamSkeletonV1(bam);
  else return buildBamSkeletonV2(bam);
};
