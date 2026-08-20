import type { RawBam } from './parseBams.types.js';
import type { RawBamV1 } from './v1/parseBamV1.types.js';

export const isBamV1 = (bam: RawBam): bam is RawBamV1 => bam.header.version === 'v1';
