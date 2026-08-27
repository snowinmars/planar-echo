import type { GhostBam, GhostBamV1 } from '@planar/shared';
import type { RawBam } from './parseBams.types.js';
import type { RawBamV1 } from './v1/parseBamV1.types.js';

export const isRawBamV1 = (bam: RawBam): bam is RawBamV1 => bam.header.version === 'v1';
export const isGhostBamV1 = (bam: GhostBam): bam is GhostBamV1 => bam.header.version === 'v1';
