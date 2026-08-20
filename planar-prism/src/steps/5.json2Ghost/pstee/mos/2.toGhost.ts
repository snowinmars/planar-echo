import type { RawMos } from '@/steps/4.biffs2json/pstee/mos/parseMoss.types.js';
import type { GhostMos } from '@planar/shared';

export const toGhost = (raw: RawMos): GhostMos => ({ ...raw });
