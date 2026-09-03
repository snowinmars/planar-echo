import type { GhostMosV1 } from '@planar/shared';

import type { RawMosV1 } from '@/steps/4.biffs2json/pstee/mos/index.js';

export const toGhostV1 = (raw: RawMosV1): GhostMosV1 => ({ ...raw });
