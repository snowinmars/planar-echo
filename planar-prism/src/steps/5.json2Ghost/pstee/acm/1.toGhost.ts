import type { GhostAcm } from '@planar/shared';

import type { RawAcm } from '../../../4.biffs2json/pstee/acm/index.js';

export const toGhost = (raw: RawAcm): GhostAcm => ({ ...raw });
