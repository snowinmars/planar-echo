import type { RawEffV20 } from '@/steps/4.biffs2json/pstee/eff/index.js';
import type { GhostEff } from '@planar/shared';

export const toGhost = (raw: RawEffV20): GhostEff => ({ ...raw });
