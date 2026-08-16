export type RawBamV1Header = Readonly<{
  signature: 'bam';
  version: 'v1';
  framesCount: number;
  cyclesCount: number;
  rleIndex: number;
  framesOffset: number;
  paletteOffset: number;
  lookupOffset: number;
}>;
