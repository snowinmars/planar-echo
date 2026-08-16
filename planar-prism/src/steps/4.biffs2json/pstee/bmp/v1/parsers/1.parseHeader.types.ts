import type { BitsPerPixel } from '../../shared/validateBitsPerPixel.types.js';
import type { Compression } from '../../shared/validateCompression.types.js';

export type RawBmpV1Header = Readonly<{
  signature: 'bm';
  version: 'v1';
  fileSize: number;
  rasterDataOffset: number;
  infoHeaderSize: number;
  width: number;
  height: number;
  topDown: boolean;
  planesCount: number;
  bitsPerPixel: BitsPerPixel;
  compression: Compression;
  imageSize: number;
  horizontalResolution: number;
  verticalResolution: number;
  usedColors: number;
  importantColors: number;
}>;
