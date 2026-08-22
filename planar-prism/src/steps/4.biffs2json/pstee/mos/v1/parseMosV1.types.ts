import type { RawMosV1Header } from './parsers/1.parseHeader.types.js';
import type { RawMosV1BlockMeta, RawMosV1IndicesBlockLayout } from './parsers/4.parseTileData.types.js';

export type RawMosV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entriesPerBlock: number;
  blocksCount: number;
  blockStride: number;
  /** Pure green RGB(0,255,0) is transparent when rendering PNG. */
  colorKey: 'green';
}>;

export type RawMosV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  blocks: RawMosV1IndicesBlockLayout[];
}>;

export type RawMosV1 = Readonly<{
  resourceName: string;
  signature: 'mos';
  variant: 'v1';
  header: RawMosV1Header;
  imageName: string;
  paletteLayout: RawMosV1PaletteLayout;
  indicesLayout: RawMosV1IndicesLayout;
  blocks: RawMosV1BlockMeta[];
}>;

export type RawMosV1Artifacts = Readonly<{
  mos: RawMosV1;
  image: Buffer;
  palette: Buffer;
  indices: Buffer;
}>;
