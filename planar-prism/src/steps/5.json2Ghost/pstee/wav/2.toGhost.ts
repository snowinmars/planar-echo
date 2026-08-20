import type { RawWav } from '@/steps/4.biffs2json/pstee/wav/parseWavs.types.js';
import type { GhostWav } from '@planar/shared';

export const toGhost = (raw: RawWav): GhostWav => ({ ...raw });
