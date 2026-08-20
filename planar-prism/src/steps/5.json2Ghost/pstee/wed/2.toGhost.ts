import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/parseWeds.types.js';
import type { GhostWed } from '@planar/shared';

export const toGhost = (raw: RawWed): GhostWed => ({ ...raw });
