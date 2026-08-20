export type GhostMosV1Header = Readonly<{
  signature: 'mos';
  version: 'v1';
  width: number;
  height: number;
  columns: number;
  rows: number;
  blockSize: number;
  paletteOffset: number;
}>;

export type GhostMosV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entriesPerBlock: number;
  blocksCount: number;
  blockStride: number;
  colorKey: 'green';
}>;

export type GhostMosV1IndicesBlockLayout = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  byteOffset: number;
  byteLength: number;
}>;

export type GhostMosV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  blocks: GhostMosV1IndicesBlockLayout[];
}>;

export type GhostMosV1BlockMeta = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  paletteByteOffset: number;
  lookupOffset: number;
  pixelDataOffset: number;
}>;

export type GhostMosV1 = Readonly<{
  resourceName: string;
  header: GhostMosV1Header;
  imageName: string;
  paletteLayout: GhostMosV1PaletteLayout;
  indicesLayout: GhostMosV1IndicesLayout;
  blocks: GhostMosV1BlockMeta[];
}>;

export type GhostMosV2Header = Readonly<{
  signature: 'mos';
  version: 'v2';
  width: number;
  height: number;
  blockCount: number;
  blocksOffset: number;
}>;

export type GhostMosV2Block = Readonly<{
  index: number;
  page: number;
  pvrzResourceName: string;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
}>;

export type GhostMosV2 = Readonly<{
  resourceName: string;
  header: GhostMosV2Header;
  imageName: string;
  blocks: GhostMosV2Block[];
}>;

export type GhostMos = GhostMosV1 | GhostMosV2;
