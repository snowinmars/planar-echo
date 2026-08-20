import type { RawPvr } from '@/steps/4.biffs2json/pstee/pvrz/index.js';
import type { GhostPvr } from '@planar/shared';

export const toGhost = (raw: RawPvr): GhostPvr => ({ ...raw });
