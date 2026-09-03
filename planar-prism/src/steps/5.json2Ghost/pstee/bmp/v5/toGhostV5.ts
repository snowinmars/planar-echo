import type { GhostBmpV5 } from '@planar/shared';

import type { RawBmpV5 } from '@/steps/4.biffs2json/pstee/bmp/index.js';

export const toGhostV5 = (raw: RawBmpV5): GhostBmpV5 => ({ ...raw });
