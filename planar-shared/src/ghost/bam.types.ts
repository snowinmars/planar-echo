export type GhostBamV1Header = Readonly<{
  signature: 'bam';
  version: 'v1';
  framesCount: number;
  cyclesCount: number;
  rleIndex: number;
  framesOffset: number;
  paletteOffset: number;
  lookupOffset: number;
}>;

export type GhostBamV1PaletteLayout = Readonly<{
  format: 'bgra';
  entryBytes: number;
  entries: number;
  transparentIndex: number;
}>;

export type GhostBamV1IndicesLayout = Readonly<{
  format: 'uint8-index';
  frames: Readonly<{
    index: number;
    width: number;
    height: number;
    byteOffset: number;
    byteLength: number;
  }>[];
}>;

export type GhostBamV1Frame = Readonly<{
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

export type GhostBamV1Cycle = Readonly<{
  index: number;
  framesCount: number;
  firstLookup: number;
  frameIndices: number[];
}>;

export type GhostBamV1 = Readonly<{
  resourceName: string;
  header: GhostBamV1Header;
  imageName: string;
  atlasWidth: number;
  atlasHeight: number;
  frames: GhostBamV1Frame[];
  cycles: GhostBamV1Cycle[];
  paletteLayout: GhostBamV1PaletteLayout;
  indicesLayout: GhostBamV1IndicesLayout;
}>;

export type GhostBamV2Header = Readonly<{
  signature: 'bam';
  version: 'v2';
  framesCount: number;
  cyclesCount: number;
  dataBlockCount: number;
  framesOffset: number;
  cyclesOffset: number;
  blocksOffset: number;
}>;

export type GhostBamV2Frame = Readonly<{
  index: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  dataBlockIndex: number;
  dataBlockCount: number;
  atlasX: number;
  atlasY: number;
}>;

export type GhostBamV2Cycle = Readonly<{
  index: number;
  framesCount: number;
  firstFrame: number;
  frameIndices: number[];
}>;

export type GhostBamV2Block = Readonly<{
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

export type GhostBamV2 = Readonly<{
  resourceName: string;
  header: GhostBamV2Header;
  imageName: string;
  atlasWidth: number;
  atlasHeight: number;
  frames: GhostBamV2Frame[];
  cycles: GhostBamV2Cycle[];
  blocks: GhostBamV2Block[];
}>;

export type GhostBam = GhostBamV1 | GhostBamV2;
