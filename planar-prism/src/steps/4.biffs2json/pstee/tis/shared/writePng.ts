import { PNG } from 'pngjs';

import { TILE_DIMENSION } from './tisCommon.js';

export const encodeRgbaPng = (width: number, height: number, rgba: Buffer): Buffer => {
  const png = new PNG({ width, height });
  rgba.copy(png.data, 0, 0, width * height * 4);
  return PNG.sync.write(png);
};

export const createAtlasBuffer = (columns: number, rows: number): Buffer => {
  return Buffer.alloc(columns * TILE_DIMENSION * rows * TILE_DIMENSION * 4, 0);
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

  for (let row = 0; row < TILE_DIMENSION; row = row + 1) {
    const srcOffset = row * TILE_DIMENSION * 4;
    const dstOffset = ((tileY + row) * atlasWidthPx + tileX) * 4;
    tileRgba.copy(atlas, dstOffset, srcOffset, srcOffset + TILE_DIMENSION * 4);
  }
};
