import type { GhostBcs } from '@planar/shared';

import type { RawBcs } from '@/steps/4.biffs2json/pstee/bcs/index.js';

export const toGhost = (raw: RawBcs): GhostBcs => ({ ...raw });
