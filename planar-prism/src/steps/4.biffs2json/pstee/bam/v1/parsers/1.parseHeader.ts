import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBamV1Header } from './1.parseHeader.types.js';

const BAM_V1_HEADER_SIZE = 24;

export const parseHeader = (reader: BufferReader, resourceName: string): RawBamV1Header => {
  const framesCount = reader.ushort();
  const cyclesCount = reader.ubyte();
  const rleIndex = reader.ubyte();
  const framesOffset = reader.uint();
  const paletteOffset = reader.uint();
  const lookupOffset = reader.uint();

  if (framesCount <= 0) throw new Error(`Invalid bam frames count '${framesCount}' for resource '${resourceName}'`);
  if (cyclesCount <= 0) throw new Error(`Invalid bam cycles count '${cyclesCount}' for resource '${resourceName}'`);
  if (framesOffset < BAM_V1_HEADER_SIZE) throw new Error(`Invalid bam frames offset '${framesOffset}' for resource '${resourceName}'`);
  if (paletteOffset < BAM_V1_HEADER_SIZE) throw new Error(`Invalid bam palette offset '${paletteOffset}' for resource '${resourceName}'`);
  if (lookupOffset < BAM_V1_HEADER_SIZE) throw new Error(`Invalid bam lookup offset '${lookupOffset}' for resource '${resourceName}'`);

  return {
    signature: 'bam',
    version: 'v1',
    framesCount,
    cyclesCount,
    rleIndex,
    framesOffset,
    paletteOffset,
    lookupOffset,
  };
};
