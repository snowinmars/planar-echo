import { MOS_V2_HEADER_SIZE } from '../../parseMos.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { MosV2Header } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader, resourceName: string): MosV2Header => {
  const width = reader.uint();
  const height = reader.uint();
  const blockCount = reader.uint();
  const blocksOffset = reader.uint();

  if (width <= 0) throw new Error(`Invalid MOS width '${width}' for resource '${resourceName}'`);
  if (height <= 0) throw new Error(`Invalid MOS height '${height}' for resource '${resourceName}'`);
  if (blockCount <= 0) throw new Error(`Invalid MOS block count '${blockCount}' for resource '${resourceName}'`);
  if (blocksOffset < MOS_V2_HEADER_SIZE) throw new Error(`Invalid MOS blocks offset '${blocksOffset}' for resource '${resourceName}'`);

  return {
    signature: 'mos',
    version: 'v2',
    width,
    height,
    blockCount,
    blocksOffset,
  };
};
