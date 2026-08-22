import sharp from 'sharp';

import { TILE_DIMENSION } from './tisCommon.js';

export const encodeRgbaPng = async (width: number, height: number, canvas: Buffer): Promise<Buffer> => {
  if (width <= 0 || height <= 0) throw new Error(`encodeRgbaPng: width and height must be > 0, got ${width}x${height}`);

  return sharp(canvas, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 2 })
    .toBuffer();
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
