import { isRawBmpV1 } from '@/steps/4.biffs2json/pstee/bmp/index.js';

import { toGhostV1 } from './v1/toGhostV1.js';
import { toGhostV5 } from './v5/toGhostV5.js';

import type { GhostBmp } from '@planar/shared';

import type { RawBmp } from '@/steps/4.biffs2json/pstee/bmp/parseBmps.types.js';

export const toGhost = (raw: RawBmp): GhostBmp => {
  if (isRawBmpV1(raw)) return toGhostV1(raw);
  return toGhostV5(raw);
};
