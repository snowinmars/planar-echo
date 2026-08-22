import type { RawMosV2Header } from './parsers/1.parseHeader.types.js';

export type RawMosV2 = Readonly<{
  resourceName: string;
  signature: 'mos';
  variant: 'v2';
  header: RawMosV2Header;
  imageName: string;
  blocks: RawMosV2Block[];
}>;

export type RawMosV2Block = Readonly<{
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

export type RawMosV2Artifacts = Readonly<{
  mos: RawMosV2;
  image: Buffer;
}>;
