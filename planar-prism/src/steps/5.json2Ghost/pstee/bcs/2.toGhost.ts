import type { RawBcs } from '@/steps/4.biffs2json/pstee/bcs/index.js';
import type { GhostBcs } from '@planar/shared';

export const toGhost = (raw: RawBcs): GhostBcs => ({ ...raw });
