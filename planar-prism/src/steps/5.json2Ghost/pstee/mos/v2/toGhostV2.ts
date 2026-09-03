import type { GhostMosV2 } from '@planar/shared';

import type { RawMosV2 } from '@/steps/4.biffs2json/pstee/mos/index.js';

export const toGhostV2 = (raw: RawMosV2): GhostMosV2 => ({ ...raw });
