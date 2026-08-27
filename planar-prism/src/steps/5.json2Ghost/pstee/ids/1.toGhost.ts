import type { RawIds } from '@/steps/4.biffs2json/pstee/ids/parseIds.types.js';
import type { GhostIds } from '@planar/shared';

export const toGhost = (raw: RawIds): GhostIds => ({ ...raw });
