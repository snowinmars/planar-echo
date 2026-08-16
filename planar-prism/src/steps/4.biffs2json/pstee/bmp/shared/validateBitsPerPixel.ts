import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { BitsPerPixel } from './validateBitsPerPixel.types.js';

export const validateBitsPerPixel = (x: number): Maybe<BitsPerPixel> => {
  switch (x) {
    case 1:
    case 4:
    case 8:
    case 16:
    case 24:
    case 32: return x;
    default: return nothing();
  }
};
