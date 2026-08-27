import { isRawCreV10 } from '@/steps/4.biffs2json/pstee/cre/isCreV1.js';

import type { GhostCre } from '@planar/shared';
import type { RawCre } from '@/steps/4.biffs2json/pstee/cre/parseCres.types.js';
import { toGhostV10 } from './v10/toGhostV10.js';
import { toGhostV11 } from './v11/toGhostV11.js';

export const toGhost = (raw: RawCre): GhostCre => {
  if (isRawCreV10(raw)) return toGhostV10(raw);
  return toGhostV11(raw);
};
