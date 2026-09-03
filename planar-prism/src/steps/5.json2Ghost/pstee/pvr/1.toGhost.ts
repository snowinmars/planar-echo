import type { GhostPvr } from '@planar/shared';

import type { RawPvr } from '@/steps/4.biffs2json/pstee/pvrz/index.js';

export const toGhost = (raw: RawPvr): GhostPvr => ({ ...raw });
