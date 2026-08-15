import type { RawTisAtlasWidthSource } from '../../parseTiss.types.js';
import type { RawTisHeader } from '../1.parseHeader.types.js';

export type RawTisTileMeta = Readonly<{
  index: number;
}>;

export type RawTisPalette = Readonly<{
  resourceName: string;
  header: RawTisHeader;
  variant: 'palette';
  columns: number;
  rows: number;
  atlasWidthSource: RawTisAtlasWidthSource;
  imageName: string;
  paletteName: string;
  indicesName: string;
  tiles: RawTisTileMeta[];
}>;

export type RawTisPaletteParseResult = Readonly<{
  tis: RawTisPalette;
  png: Buffer;
  palette: Buffer;
  indices: Buffer;
}>;
