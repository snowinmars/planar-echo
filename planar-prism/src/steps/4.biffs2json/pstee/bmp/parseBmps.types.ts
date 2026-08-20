import type { RawBmpV1 } from './v1/parseBmpV1.types.js';
import type { RawBmpV5 } from './v5/parseBmpV5.types.js';
import type { RawBmpV1Artifacts } from './v1/parseBmpV1.types.js';
import type { RawBmpV5Artifacts } from './v5/parseBmpV5.types.js';

export type RawBmp = RawBmpV1 | RawBmpV5;
export type RawBmpArtifacts = RawBmpV1Artifacts | RawBmpV5Artifacts;
