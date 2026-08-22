import type { RawBamV2Header } from './parsers/1.parseHeader.types.js';
import type { RawBamV2CycleEntry } from './parsers/3.parseCycles.types.js';
import type { RawBamV2DataBlock } from './parsers/4.parseBlocks.types.js';

export type RawBamV2Frame = Readonly<{
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

export type RawBamV2 = Readonly<{
  resourceName: string;
  header: RawBamV2Header;
  imageName: string;
  atlasWidth: number;
  atlasHeight: number;
  frames: RawBamV2Frame[];
  cycles: RawBamV2CycleEntry[];
  blocks: RawBamV2DataBlock[];
}>;

export type RawBamV2Artifacts = Readonly<{
  bam: RawBamV2;
  image: Buffer;
}>;
