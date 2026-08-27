import type { RawMosV2 } from '@/steps/4.biffs2json/pstee/mos/index.js';
import type { GhostMosV2 } from '@planar/shared';

export const toGhostV2 = (raw: RawMosV2): GhostMosV2 => ({ ...raw });
