import { PNG } from 'pngjs'; // TODO [snow]: try to migrate to sharp npmjs package

import { TILE_DIMENSION } from './tisCommon.js';

export const encodeRgbaPng = (width: number, height: number, rgba: Buffer): Buffer => {
  const png = new PNG({ width, height });
  rgba.copy(png.data, 0, 0, width * height * 4);
  return PNG.sync.write(png);
};

export const createAtlasBuffer = (columns: number, rows: number): Buffer => {
  return Buffer.alloc(columns * TILE_DIMENSION * rows * TILE_DIMENSION * 4, 0); // TODO [snow]: allocUnsafe ?
};

export const blitTileRgba = (
  atlas: Buffer,
  atlasColumns: number,
  tileIndex: number,
  tileRgba: Buffer,
): void => {
  const atlasWidthPx = atlasColumns * TILE_DIMENSION;
  const tileX = (tileIndex % atlasColumns) * TILE_DIMENSION;
  const tileY = Math.floor(tileIndex / atlasColumns) * TILE_DIMENSION;

  // TODO [snow]: can I copy less?
  for (let row = 0; row < TILE_DIMENSION; row = row + 1) {
    const srcOffset = row * TILE_DIMENSION * 4;
    const dstOffset = ((tileY + row) * atlasWidthPx + tileX) * 4;
    tileRgba.copy(atlas, dstOffset, srcOffset, srcOffset + TILE_DIMENSION * 4);
  }
};
