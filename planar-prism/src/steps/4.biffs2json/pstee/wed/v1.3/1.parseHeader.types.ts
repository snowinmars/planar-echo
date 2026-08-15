export type RawWedHeader = Readonly<{
  signature: 'wed';
  version: 'v1.3';
  overlaysCount: number;
  doorsCount: number;
  overlaysOffset: number;
  secondaryHeaderOffset: number;
  doorsOffset: number;
  doorsTileCellsOffset: number;
}>;
