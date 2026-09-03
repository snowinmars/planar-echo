import type { GhostTis } from '@planar/shared';

import type { RawTis } from '@/steps/4.biffs2json/pstee/tis/parseTiss.types.js';

export const toGhost = (raw: RawTis): GhostTis => ({ ...raw });
