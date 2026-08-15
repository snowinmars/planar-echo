import type { PALETTE_TILE_SIZE, PVRZ_TILE_SIZE } from '../shared/tisCommon.js';

export type RawTisHeader = Readonly<{
  signature: 'tis';
  version: 'v1';
  tileCount: number;
  tileSize: typeof PALETTE_TILE_SIZE | typeof PVRZ_TILE_SIZE;
  headerSize: number;
  tileDimension: number;
}>;
