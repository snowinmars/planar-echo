import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { Compression } from './validateCompression.types.js';

export const validateCompression = (x: number): Maybe<Compression> => {
  switch (x) {
    case 0: return 'bi_rgb';
    case 1: return 'bi_rle8';
    case 2: return 'bi_rle4';
    case 3: return 'bi_bitfields';
    default: return nothing();
  }
};
