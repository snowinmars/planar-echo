import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBamV2Header } from './1.parseHeader.types.js';

const BAM_V2_HEADER_SIZE = 32;

export const parseHeader = (reader: BufferReader, resourceName: string): RawBamV2Header => {
  const framesCount = reader.uint();
  const cyclesCount = reader.uint();
  const dataBlockCount = reader.uint();
  const framesOffset = reader.uint();
  const cyclesOffset = reader.uint();
  const blocksOffset = reader.uint();

  if (framesCount <= 0) throw new Error(`Invalid bam V2 frames count '${framesCount}' for resource '${resourceName}'`);
  if (cyclesCount <= 0) throw new Error(`Invalid bam V2 cycles count '${cyclesCount}' for resource '${resourceName}'`);
  if (dataBlockCount <= 0) throw new Error(`Invalid bam V2 data block count '${dataBlockCount}' for resource '${resourceName}'`);
  if (framesOffset < BAM_V2_HEADER_SIZE) throw new Error(`Invalid bam V2 frames offset '${framesOffset}' for resource '${resourceName}'`);
  if (cyclesOffset < BAM_V2_HEADER_SIZE) throw new Error(`Invalid bam V2 cycles offset '${cyclesOffset}' for resource '${resourceName}'`);
  if (blocksOffset < BAM_V2_HEADER_SIZE) throw new Error(`Invalid bam V2 blocks offset '${blocksOffset}' for resource '${resourceName}'`);

  return {
    signature: 'bam',
    version: 'v2',
    framesCount,
    cyclesCount,
    dataBlockCount,
    framesOffset,
    cyclesOffset,
    blocksOffset,
  };
};
