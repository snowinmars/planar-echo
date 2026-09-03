import type { GhostBamV2 } from '@planar/shared';

import type { RawBamV2 } from '@/steps/4.biffs2json/pstee/bam/index.js';

export const toGhostV2 = (raw: RawBamV2): GhostBamV2 => ({ ...raw });
