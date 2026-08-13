import type { MosV1Header } from './v1/parsers/1.parseHeader.types.js';
import type { MosV2Header } from './v2/parsers/1.parseHeader.types.js';

export const MOS_BLOCK_DIMENSION = 64;
export const MOS_V2_HEADER_SIZE = 24;
export const MOS_V2_BLOCK_SIZE = 28;
export const MOS_PALETTE_ENTRIES = 256;
export const MOS_PALETTE_ENTRY_BYTES = 4;
export const MOS_PALETTE_BLOCK_STRIDE = MOS_PALETTE_ENTRIES * MOS_PALETTE_ENTRY_BYTES;

export type Signature = 'mos';
export type Versions = 'v1' | 'v2';

export type MosV1 = Readonly<{
  resourceName: string;
  signature: Signature;
  variant: 'v1';
  header: MosV1Header;
  paletteLayout: MosV1PaletteLayout;
  indicesLayout: MosV1IndicesLayout;
  blocks: MosV1BlockMeta[];
}>;

export type MosV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entriesPerBlock: number;
  blocksCount: number;
  blockStride: number;
  /** Pure green RGB(0,255,0) is transparent when rendering PNG. */
  colorKey: 'green';
}>;

export type MosV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  blocks: MosV1IndicesBlockLayout[];
}>;

export type MosV1IndicesBlockLayout = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  byteOffset: number;
  byteLength: number;
}>;

export type MosV1BlockMeta = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  paletteByteOffset: number;
  lookupOffset: number;
  pixelDataOffset: number;
}>;

export type MosV2 = Readonly<{
  resourceName: string;
  signature: Signature;
  variant: 'v2';
  header: MosV2Header;
  imageName: string;
  blocks: MosV2Block[];
}>;

export type MosV2Block = Readonly<{
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

export type ParsedMosV1Artifacts = Readonly<{
  mos: MosV1;
  png: Buffer;
  palette: Buffer;
  indices: Buffer;
}>;

export type ParsedMosV2Artifacts = Readonly<{
  mos: MosV2;
  png: Buffer;
}>;

export const isMosV1Artifacts = (x: ParsedMosV1Artifacts | ParsedMosV2Artifacts): x is ParsedMosV1Artifacts => x.mos.variant === 'v1';
