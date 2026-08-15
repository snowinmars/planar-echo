import type { RawTisParsePaletteTisResult } from './palette/parsePaletteTis.types.js';
import type { RawTisParsePvrzTisResult } from './pvrz/parsePvrzTis.types.js';

export type RawTisArtifacts = RawTisParsePaletteTisResult | RawTisParsePvrzTisResult;

export const isPaletteArtfact = (x: RawTisArtifacts): x is RawTisParsePaletteTisResult => x.tis.variant === 'palette';
