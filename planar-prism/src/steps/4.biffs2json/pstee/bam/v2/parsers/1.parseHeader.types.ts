export type RawBamV2Header = Readonly<{
  signature: 'bam';
  version: 'v2';
  framesCount: number;
  cyclesCount: number;
  dataBlockCount: number;
  framesOffset: number;
  cyclesOffset: number;
  blocksOffset: number;
}>;
