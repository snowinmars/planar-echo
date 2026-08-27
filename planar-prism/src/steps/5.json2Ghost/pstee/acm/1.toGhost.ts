import type { RawAcm } from '../../../4.biffs2json/pstee/acm/index.js';
import type { GhostAcm } from '@planar/shared';

export const toGhost = (raw: RawAcm): GhostAcm => ({ ...raw });
