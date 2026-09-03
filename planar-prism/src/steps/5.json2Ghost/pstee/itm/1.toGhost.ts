import { isRawItmV10 } from '@/steps/4.biffs2json/pstee/itm/isItmV1.js';

import { toGhostV10 } from './v10/toGhostV10.js';

import type { GhostItm } from '@planar/shared';

import type { RawItm } from '@/steps/4.biffs2json/pstee/itm/parseItms.types.js';

export const toGhost = (raw: RawItm): GhostItm => {
  if (isRawItmV10(raw)) return toGhostV10(raw);
  throw new Error(`Itm header version is out of range`);
};
