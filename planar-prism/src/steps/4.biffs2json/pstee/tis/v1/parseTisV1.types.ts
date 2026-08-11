import type { ParsePaletteTisResult } from './palette/parsePaletteTis.types.js';
import type { ParsePvrzTisResult } from './pvrz/parsePvrzTis.types.js';

export type ParsedTisArtifacts = ParsePaletteTisResult | ParsePvrzTisResult;

export const isPaletteArtfact = (x: ParsedTisArtifacts): x is ParsePaletteTisResult => x.tis.variant === 'palette';
