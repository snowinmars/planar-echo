import { isRawBamV1 } from '../../../4.biffs2json/pstee/bam/index.js';
import { toGhostV1 } from './v1/toGhostV1.js';
import { toGhostV2 } from './v2/toGhostV2.js';

import type { GhostBam } from '@planar/shared';

import type { RawBam } from '@/steps/4.biffs2json/pstee/bam/index.js';

export const toGhost = (raw: RawBam): GhostBam => {
  if (isRawBamV1(raw)) return toGhostV1(raw);
  else return toGhostV2(raw);
};
