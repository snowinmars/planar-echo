import type { RawMosV1Artifacts } from './v1/parseMosV1.types.js';
import type { RawMosV2Artifacts } from './v2/parseMosV2.types.js';

export const MOS_BLOCK_DIMENSION = 64;
export const MOS_V2_HEADER_SIZE = 24;
export const MOS_V2_BLOCK_SIZE = 28;
export const MOS_PALETTE_ENTRIES = 256;
export const MOS_PALETTE_ENTRY_BYTES = 4;
export const MOS_PALETTE_BLOCK_STRIDE = MOS_PALETTE_ENTRIES * MOS_PALETTE_ENTRY_BYTES;

export const isMosV1Artifacts = (x: RawMosV1Artifacts | RawMosV2Artifacts): x is RawMosV1Artifacts => x.mos.variant === 'v1';
