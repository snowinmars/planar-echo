export type RawMosV2Header = Readonly<{
  signature: 'mos';
  version: 'v2';
  width: number;
  height: number;
  blockCount: number;
  blocksOffset: number;
}>;
