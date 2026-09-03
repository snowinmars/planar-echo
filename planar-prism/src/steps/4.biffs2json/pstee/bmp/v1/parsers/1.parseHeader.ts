import { isNothing } from '@planar/shared';

import { validateBitsPerPixel } from '../../shared/validateBitsPerPixel.js';
import { validateCompression } from '../../shared/validateCompression.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBmpV1Header } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader, resourceName: string): RawBmpV1Header => {
  const fileSize = reader.uint();
  reader.skip.uint();
  const rasterDataOffset = reader.uint();
  const infoHeaderSize = reader.uint();
  const width = reader.int();
  const heightRaw = reader.int();
  const planesCount = reader.ushort();
  const rawBitsPerPixel = reader.ushort();
  const rawCompression = reader.uint();
  const imageSize = reader.uint();
  const horizontalResolution = reader.uint();
  const verticalResolution = reader.uint();
  const usedColors = reader.uint();
  const importantColors = reader.uint();

  const topDown = heightRaw < 0;
  const height = Math.abs(heightRaw);

  if (planesCount !== 1) throw new Error(`Invalid bmp planes count '${planesCount}' for resource '${resourceName}'`);

  const bitsPerPixel = validateBitsPerPixel(rawBitsPerPixel);
  if (isNothing(bitsPerPixel)) throw new Error(`Unsupported bmp bits per pixel '${rawBitsPerPixel}' for resource '${resourceName}'`);

  const compression = validateCompression(rawCompression);
  if (isNothing(compression)) throw new Error(`Unsupported bmp compression '${rawCompression}' for resource '${resourceName}'`);

  return {
    signature: 'bm',
    version: 'v1',
    fileSize,
    rasterDataOffset,
    infoHeaderSize,
    width,
    height,
    topDown,
    planesCount,
    bitsPerPixel,
    compression,
    imageSize,
    horizontalResolution,
    verticalResolution,
    usedColors,
    importantColors,
  };
};
