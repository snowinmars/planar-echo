import { MOS_BLOCK_DIMENSION } from '../../parseMoss.const.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawMosV1Header } from './1.parseHeader.types.js';

const MOS_V1_HEADER_SIZE = 24;
export const parseHeader = (reader: BufferReader, resourceName: string): RawMosV1Header => {
  const width = reader.ushort();
  const height = reader.ushort();
  const columns = reader.ushort();
  const rows = reader.ushort();
  const blockSize = reader.uint();
  const paletteOffset = reader.uint();

  if (width <= 0) throw new Error(`Invalid MOS width '${width}' for resource '${resourceName}'`);
  if (height <= 0) throw new Error(`Invalid MOS height '${height}' for resource '${resourceName}'`);
  if (columns <= 0 || rows <= 0) throw new Error(`Invalid MOS grid '${columns}x${rows}' for resource '${resourceName}'`);
  if (blockSize !== MOS_BLOCK_DIMENSION) throw new Error(`Invalid MOS block size '${blockSize}' for resource '${resourceName}'`);
  if (paletteOffset < MOS_V1_HEADER_SIZE) throw new Error(`Invalid MOS palette offset '${paletteOffset}' for resource '${resourceName}'`);

  return {
    signature: 'mos',
    version: 'v1',
    width,
    height,
    columns,
    rows,
    blockSize,
    paletteOffset,
  };
};
