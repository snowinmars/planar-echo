export type Signature = 'wed';
export type Versions = 'v1.3';

export type WedHeader = Readonly<{
  signature: Signature;
  version: Versions;
  overlaysCount: number;
  doorsCount: number;
  overlaysOffset: number;
  secondaryHeaderOffset: number;
  doorsOffset: number;
  doorsTileCellsOffset: number;
}>;
