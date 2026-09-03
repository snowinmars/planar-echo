import type { GhostBamV1 } from '@planar/shared';

import type { RawBamV1 } from '@/steps/4.biffs2json/pstee/bam/index.js';

export const toGhostV1 = (raw: RawBamV1): GhostBamV1 => ({ ...raw });
