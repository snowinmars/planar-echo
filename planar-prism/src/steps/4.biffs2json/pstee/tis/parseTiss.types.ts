import type { RawTisPalette } from './v1/palette/parsePaletteTis.types.js';
import type { RawTisPvrz } from './v1/pvrz/parsePvrzTis.types.js';

export type RawTisAtlasWidthSource = 'wed' | 'fallback';

export type RawTis = RawTisPalette | RawTisPvrz;
