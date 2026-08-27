import type { GhostBmp, GhostBmpV1 } from '@planar/shared';
import type { RawBmp } from './parseBmps.types.js';
import type { RawBmpV1 } from './v1/parseBmpV1.types.js';

export const isRawBmpV1 = (bmp: RawBmp): bmp is RawBmpV1 => bmp.header.version === 'v1';
export const isGhostBmpV1 = (bmp: GhostBmp): bmp is GhostBmpV1 => bmp.header.version === 'v1';
