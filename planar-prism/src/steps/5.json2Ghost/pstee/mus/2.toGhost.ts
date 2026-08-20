import type { RawMus } from '@/steps/4.biffs2json/pstee/mus/parseMuss.types.js';
import type { GhostMus } from '@planar/shared';

export const toGhost = (raw: RawMus): GhostMus => ({ ...raw });
