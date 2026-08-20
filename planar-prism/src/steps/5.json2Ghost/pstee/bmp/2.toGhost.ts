import type { RawBmp } from '@/steps/4.biffs2json/pstee/bmp/parseBmps.types.js';
import type { GhostBmp } from '@planar/shared';

export const toGhost = (raw: RawBmp): GhostBmp => ({ ...raw });
