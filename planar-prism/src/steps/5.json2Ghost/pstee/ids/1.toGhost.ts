import type { GhostIds } from '@planar/shared';

import type { RawIds } from '@/steps/4.biffs2json/pstee/ids/parseIds.types.js';

export const toGhost = (raw: RawIds): GhostIds => ({ ...raw });
