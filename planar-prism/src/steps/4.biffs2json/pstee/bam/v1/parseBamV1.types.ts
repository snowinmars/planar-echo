import type { RawBamV1Header } from './parsers/1.parseHeader.types.js';
import type { RawBamV1CycleEntry } from './parsers/3.parseCycles.types.js';

export type RawBamV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entries: number;
  transparentIndex: number;
}>;

export type RawBamV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  frames: Readonly<{
    index: number;
    width: number;
    height: number;
    byteOffset: number;
    byteLength: number;
  }>[];
}>;

export type RawBamV1Frame = Readonly<{
  index: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  dataOffset: number;
  compressed: boolean;
  atlasX: number;
  atlasY: number;
}>;

export type RawBamV1 = Readonly<{
  resourceName: string;
  header: RawBamV1Header;
  imageName: string;
  atlasWidth: number;
  atlasHeight: number;
  frames: RawBamV1Frame[];
  cycles: RawBamV1CycleEntry[];
  paletteLayout: RawBamV1PaletteLayout;
  indicesLayout: RawBamV1IndicesLayout;
}>;

export type RawBamV1Artifacts = Readonly<{
  bam: RawBamV1;
  image: Buffer;
  palette: Buffer;
  indices: Buffer;
}>;
