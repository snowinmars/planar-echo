import type { RawMosV1 } from '@/steps/4.biffs2json/pstee/mos/index.js';
import type { GhostMosV1 } from '@planar/shared';

export const toGhostV1 = (raw: RawMosV1): GhostMosV1 => ({ ...raw });
