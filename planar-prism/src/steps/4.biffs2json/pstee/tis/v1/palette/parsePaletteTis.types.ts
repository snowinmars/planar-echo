import type { PaletteTis } from '../../parseTis.types.js';

export type ParsePaletteTisResult = Readonly<{
  tis: PaletteTis;
  png: Buffer;
  palette: Buffer;
  indices: Buffer;
}>;
