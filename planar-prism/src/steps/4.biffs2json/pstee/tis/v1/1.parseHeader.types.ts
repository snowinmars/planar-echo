import type { PALETTE_TILE_SIZE, PVRZ_TILE_SIZE } from '../shared/tisCommon.js';

export type Signature = 'tis';
export type Versions = 'v1';

export type TisHeader = Readonly<{
  signature: Signature;
  version: Versions;
  tileCount: number;
  tileSize: typeof PALETTE_TILE_SIZE | typeof PVRZ_TILE_SIZE;
  headerSize: number;
  tileDimension: number;
}>;
