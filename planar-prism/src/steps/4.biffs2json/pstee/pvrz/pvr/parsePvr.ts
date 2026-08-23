import { PVR_SIGNATURE } from './parsePvr.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawPvrPixelFormat } from '../parsePvrzs.types.js';
import type { RawPvr } from './parsePvr.types.js';

const DXT1_PIXEL_FORMAT = 7;
const DXT5_PIXEL_FORMAT = 11;

type DetectPixelFormatProps = Readonly<{
  resourceName: string;
  high: number;
  low: number;
}>;
const detectPixelFormat = ({
  resourceName,
  high,
  low,
}: DetectPixelFormatProps): RawPvrPixelFormat => {
  if (high !== 0) return 'dxt1';
  switch (low) {
    case DXT1_PIXEL_FORMAT: return 'dxt1';
    case DXT5_PIXEL_FORMAT: return 'dxt5';
    default: throw new Error(`Unsupported pvr pixelFormat: high='${high}', low='${low}' for resource '${resourceName}'`);
  }
};

export const parsePvr = (reader: BufferReader, resourceName: string): RawPvr => {
  const initialOffset = reader.offset;

  const signature = reader.uint();
  if (signature !== PVR_SIGNATURE) throw new Error(`Unsupported pvr signature '${signature}' for resource '${resourceName}'`);

  const flags = reader.uint();
  if (flags !== 0 && flags !== 1) throw new Error(`Unsupported pvr flags '${flags}' for resource '${resourceName}'`);

  const pixelFormatLow = reader.uint();
  const pixelFormatHigh = reader.uint();

  const pixelFormat = detectPixelFormat({
    resourceName,
    low: pixelFormatLow,
    high: pixelFormatHigh,
  });

  const colorSpace = reader.uint();
  if (colorSpace !== 0 && colorSpace !== 1) throw new Error(`Unsupported color space '${colorSpace}' for resource '${resourceName}'`);

  const channelType = reader.uint();
  if ( // otherwise compilator do not understand it
    channelType !== 0
    && channelType !== 1
    && channelType !== 2
    && channelType !== 3
    && channelType !== 4
    && channelType !== 5
    && channelType !== 6
    && channelType !== 7
    && channelType !== 8
    && channelType !== 9
    && channelType !== 10
    && channelType !== 11
    && channelType !== 12
  ) throw new Error(`Unsupported channel type '${channelType}' for resource '${resourceName}'`);

  const height = reader.uint();
  const width = reader.uint();
  const depth = reader.uint();
  const numSurfaces = reader.uint();
  const numFaces = reader.uint();
  const mipmapCount = reader.uint();
  const metadataSize = reader.uint();

  const read = reader.offset - initialOffset; // 0x34 = 52 bytes = 13 uints
  const pixelDataOffset = read + metadataSize;
  reader.skip.custom(pixelDataOffset);

  return {
    resourceName,
    signature,
    flags,
    pixelFormat,
    colorSpace,
    channelType,
    height,
    width,
    depth,
    numSurfaces,
    numFaces,
    mipmapCount,
    metadataSize,
    pixelDataOffset,
  };
};
