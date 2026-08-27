import type { RawBamV1 } from '@/steps/4.biffs2json/pstee/bam/index.js';
import type { GhostBamV1 } from '@planar/shared';

export const toGhostV1 = (raw: RawBamV1): GhostBamV1 => ({ ...raw });
