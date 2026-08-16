import type { RawTisPaletteParseResult } from './palette/parsePaletteTis.types.js';
import type { RawTisPvrzParseResult } from './pvrz/parsePvrzTis.types.js';

export type RawTisArtifacts = RawTisPaletteParseResult | RawTisPvrzParseResult;

export const isPaletteArtfact = (x: RawTisArtifacts): x is RawTisPaletteParseResult => x.tis.variant === 'palette';
