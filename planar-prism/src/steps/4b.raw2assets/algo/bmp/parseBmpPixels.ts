import type { Maybe } from '@planar/shared';

import type { BitsPerPixel } from '@/steps/4.biffs2json/pstee/bmp/shared/validateBitsPerPixel.types.js';
import type { Compression } from '@/steps/4.biffs2json/pstee/bmp/shared/validateCompression.types.js';

/**
 * Mostly llm generated from gemrb/nearinfinity
 */

export type BmpMasks = Readonly<{
  redMask: number;
  greenMask: number;
  blueMask: number;
  alphaMask: number;
}>;

export type RawBmpPixels = Readonly<{
  indices?: Buffer | undefined;
  rgba: Buffer;
}>;

const paddedRowBytes = (width: number, bitCount: number): number => {
  const raw = Math.ceil(width * bitCount / 8);

  return (raw + 3) & ~3;
};

const maskShift = (mask: number): number => {
  if (mask === 0) return 0;

  let shift = 0;
  let m = mask;

  while ((m & 1) === 0) {
    m = m >>> 1;
    shift = shift + 1;
  }

  return shift;
};

const maskScale = (value: number, mask: number, shift: number): number => {
  if (mask === 0) return 0;

  const bits = (mask >>> shift).toString(2).length;
  const max = (1 << bits) - 1;

  if (max <= 0) return 0;

  return Math.round(((value & mask) >>> shift) * 255 / max);
};

const decodeUncompressed = (props: ParseBmpPixelsProps): RawBmpPixels => {
  const {
    blob,
    width,
    height,
    topDown,
    bitsPerPixel,
    masks,
  } = props;

  const rowBytes = paddedRowBytes(width, bitsPerPixel);
  const indices = bitsPerPixel <= 8 ? Buffer.alloc(width * height) : undefined;
  const rgba = Buffer.alloc(width * height * 4, 0);
  const redMask = masks?.redMask ?? 0x00ff0000;
  const greenMask = masks?.greenMask ?? 0x0000ff00;
  const blueMask = masks?.blueMask ?? 0x000000ff;
  const alphaMask = masks?.alphaMask ?? (bitsPerPixel === 32 ? 0xff000000 : 0);
  const rShift = maskShift(redMask);
  const gShift = maskShift(greenMask);
  const bShift = maskShift(blueMask);
  const aShift = maskShift(alphaMask);

  for (let row = 0; row < height; row++) {
    const srcRow = topDown ? row : height - 1 - row;
    const srcOffset = srcRow * rowBytes;

    for (let x = 0; x < width; x++) {
      const dst = (row * width + x);

      if (bitsPerPixel === 4) {
        const packed = blob[srcOffset + (x >> 1)] ?? 0;
        const index = (x & 1) === 0 ? packed >> 4 : packed & 0x0f;
        indices![dst] = index;
      }
      else if (bitsPerPixel === 8) {
        indices![dst] = blob[srcOffset + x] ?? 0;
      }
      else if (bitsPerPixel === 16) {
        const pix = blob.readUInt16LE(srcOffset + x * 2);
        const r = ((pix >> 10) & 0x1f) * 255 / 31;
        const g = ((pix >> 5) & 0x1f) * 255 / 31;
        const b = (pix & 0x1f) * 255 / 31;
        const out = dst * 4;
        rgba[out] = r;
        rgba[out + 1] = g;
        rgba[out + 2] = b;
        rgba[out + 3] = 255;
      }
      else if (bitsPerPixel === 24) {
        const out = dst * 4;
        rgba[out] = blob[srcOffset + x * 3 + 2] ?? 0;
        rgba[out + 1] = blob[srcOffset + x * 3 + 1] ?? 0;
        rgba[out + 2] = blob[srcOffset + x * 3] ?? 0;
        rgba[out + 3] = 255;
      }
      else if (bitsPerPixel === 32) {
        const pix = blob.readUInt32LE(srcOffset + x * 4);
        const out = dst * 4;
        rgba[out] = maskScale(pix, redMask, rShift);
        rgba[out + 1] = maskScale(pix, greenMask, gShift);
        rgba[out + 2] = maskScale(pix, blueMask, bShift);
        rgba[out + 3] = alphaMask === 0 ? 255 : maskScale(pix, alphaMask, aShift);
      }
    }
  }

  return { indices, rgba };
};

const decodeRle = (props: ParseBmpPixelsProps): RawBmpPixels => {
  const {
    blob,
    resourceName,
    width,
    height,
    topDown,
    bitsPerPixel,
    compression,
  } = props;

  if (compression === 'bi_rle8' && bitsPerPixel !== 8) throw new Error(`RLE8 requires 8-bit bmp for resource '${resourceName}'`);

  if (compression === 'bi_rle4' && bitsPerPixel !== 4) throw new Error(`RLE4 requires 4-bit bmp for resource '${resourceName}'`);

  const indices = Buffer.alloc(width * height, 0);
  let i = 0;
  let x = 0;
  let y = topDown ? 0 : height - 1;
  const yStep = topDown ? 1 : -1;

  const put = (px: number, py: number, index: number): void => {
    if (px < 0 || px >= width || py < 0 || py >= height) return;
    indices[py * width + px] = index;
  };

  while (i + 1 < blob.length) {
    const b1 = blob[i]!;
    const b2 = blob[i + 1]!;
    i = i + 2;
    if (b1 === 0) {
      if (b2 === 0) {
        x = 0;
        y = y + yStep;
      }
      else if (b2 === 1) {
        break;
      }
      else if (b2 === 2) {
        if (i + 1 >= blob.length) break;
        x = x + blob[i]!;
        y = y + yStep * blob[i + 1]!;
        i = i + 2;
      }
      else {
        const count = b2;
        if (compression === 'bi_rle8') {
          for (let n = 0; n < count; n++) {
            put(x, y, blob[i + n] ?? 0);
            x = x + 1;
          }
          i = i + count;
          if (count & 1) i = i + 1;
        }
        else {
          for (let n = 0; n < count; n++) {
            const packed = blob[i + (n >> 1)] ?? 0;
            const index = (n & 1) === 0 ? packed >> 4 : packed & 0x0f;
            put(x, y, index);
            x = x + 1;
          }
          const bytes = (count + 1) >> 1;
          i = i + bytes;
          if (bytes & 1) i = i + 1;
        }
      }
    }
    else if (compression === 'bi_rle8') {
      for (let n = 0; n < b1; n++) {
        put(x, y, b2);
        x = x + 1;
      }
    }
    else {
      const hi = b2 >> 4;
      const lo = b2 & 0x0f;
      for (let n = 0; n < b1; n++) {
        put(x, y, (n & 1) === 0 ? hi : lo);
        x = x + 1;
      }
    }
  }

  return { indices, rgba: Buffer.alloc(width * height * 4, 0) };
};

export type ParseBmpPixelsProps = Readonly<{
  blob: Buffer;
  resourceName: string;
  width: number;
  height: number;
  topDown: boolean;
  bitsPerPixel: BitsPerPixel;
  compression: Compression;
  masks?: Maybe<BmpMasks>;
}>;
export const parseBmpPixels = (props: ParseBmpPixelsProps): RawBmpPixels => {
  if (props.compression === 'bi_rle8' || props.compression === 'bi_rle4') return decodeRle(props);

  if (props.bitsPerPixel === 1) throw new Error(`Unsupported bmp bits per pixel '${props.bitsPerPixel}' for resource '${props.resourceName}'`);

  return decodeUncompressed(props);
};
