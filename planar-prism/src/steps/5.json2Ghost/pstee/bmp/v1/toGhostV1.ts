import type { GhostBmpV1 } from '@planar/shared';

import type { RawBmpV1 } from '@/steps/4.biffs2json/pstee/bmp/index.js';

export const toGhostV1 = (raw: RawBmpV1): GhostBmpV1 => ({ ...raw });
