import type { RawBam } from '@/steps/4.biffs2json/pstee/bam/index.js';
import type { GhostBam } from '@planar/shared';

export const toGhost = (raw: RawBam): GhostBam => ({ ...raw });
