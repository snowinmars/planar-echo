export type RawMosV1Header = Readonly<{
  signature: 'mos';
  version: 'v1';
  width: number;
  height: number;
  columns: number;
  rows: number;
  blockSize: number;
  paletteOffset: number;
}>;
