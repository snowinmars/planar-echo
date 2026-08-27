import type { RawBmpV1 } from '@/steps/4.biffs2json/pstee/bmp/index.js';
import type { GhostBmpV1 } from '@planar/shared';

export const toGhostV1 = (raw: RawBmpV1): GhostBmpV1 => ({ ...raw });
