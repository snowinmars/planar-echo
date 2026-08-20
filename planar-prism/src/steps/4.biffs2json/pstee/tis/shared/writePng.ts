import { crc32, deflateSync } from 'zlib';

import { TILE_DIMENSION } from './tisCommon.js';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const IHDR = Buffer.from('IHDR');
const IDAT = Buffer.from('IDAT');
const IEND = Buffer.from('IEND');
const COLOR_TYPE_RGBA = 6;
const BIT_DEPTH = 8;

const u32be = (value: number): Buffer => {
  const buf = Buffer.allocUnsafe(4);
  buf.writeUInt32BE(value, 0);
  return buf;
};

const chunk = (type: Buffer, data: Buffer): Buffer => {
  const crcInput = Buffer.concat([type, data]);
  return Buffer.concat([
    u32be(data.length),
    crcInput,
    u32be(crc32(crcInput)),
  ]);
};

export const encodeRgbaPng = (width: number, height: number, rgba: Buffer): Buffer => {
  const rowBytes = width * 4;
  const scanlines = Buffer.allocUnsafe(height * (1 + rowBytes));

  for (let y = 0; y < height; y++) {
    const dst = y * (1 + rowBytes);
    scanlines[dst] = 0;
    rgba.copy(scanlines, dst + 1, y * rowBytes, y * rowBytes + rowBytes);
  }

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = BIT_DEPTH;
  ihdr[9] = COLOR_TYPE_RGBA;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk(IHDR, ihdr),
    chunk(IDAT, deflateSync(scanlines, { level: 0 })),
    chunk(IEND, Buffer.alloc(0)),
  ]);
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
