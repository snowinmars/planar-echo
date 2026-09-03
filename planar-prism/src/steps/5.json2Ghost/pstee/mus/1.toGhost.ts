import type { GhostMus } from '@planar/shared';

import type { RawMus } from '@/steps/4.biffs2json/pstee/mus/parseMuss.types.js';

export const toGhost = (raw: RawMus): GhostMus => ({ ...raw });
