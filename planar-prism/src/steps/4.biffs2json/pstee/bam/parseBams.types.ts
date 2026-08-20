import type { RawBamV1 } from './v1/parseBamV1.types.js';
import type { RawBamV2 } from './v2/parseBamV2.types.js';

export type RawBam = RawBamV1 | RawBamV2;
