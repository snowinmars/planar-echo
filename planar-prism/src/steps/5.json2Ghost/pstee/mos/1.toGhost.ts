import { isGhostMosV1 } from '@/steps/4.biffs2json/pstee/mos/isMosV1.js';

import { toGhostV1 } from './v1/toGhostV1.js';
import { toGhostV2 } from './v2/toGhostV2.js';

import type { GhostMos } from '@planar/shared';

import type { RawMos } from '@/steps/4.biffs2json/pstee/mos/parseMoss.types.js';

export const toGhost = (mos: RawMos): GhostMos => {
  if (isGhostMosV1(mos)) return toGhostV1(mos);
  else return toGhostV2(mos);
};
