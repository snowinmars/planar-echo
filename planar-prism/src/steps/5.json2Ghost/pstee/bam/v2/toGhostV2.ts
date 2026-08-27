import type { RawBamV2 } from '@/steps/4.biffs2json/pstee/bam/index.js';
import type { GhostBamV2 } from '@planar/shared';

export const toGhostV2 = (raw: RawBamV2): GhostBamV2 => ({ ...raw });
