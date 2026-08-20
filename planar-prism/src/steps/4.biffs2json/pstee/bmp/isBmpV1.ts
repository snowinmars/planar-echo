import type { RawBmp } from './parseBmps.types.js';
import type { RawBmpV1 } from './v1/parseBmpV1.types.js';

export const isBmpV1 = (bmp: RawBmp): bmp is RawBmpV1 => bmp.header.version === 'v1';
