import {
  PALETTE_TILE_SIZE,
  PVRZ_TILE_SIZE,
  TILE_DIMENSION,
} from '../shared/tisCommon.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawTisHeader } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader, resourceName: string): RawTisHeader => {
  const tileCount = reader.uint();
  const tileSize = reader.uint();
  const headerSize = reader.uint();
  const tileDimension = reader.uint();

  if (tileCount <= 0) throw new Error(`Invalid tile count '${tileCount}' for resource '${resourceName}'`);
  if (tileSize !== PALETTE_TILE_SIZE && tileSize !== PVRZ_TILE_SIZE) throw new Error(`Unsupported TIS tile size '${tileSize}' for resource '${resourceName}'`);
  if (tileDimension !== TILE_DIMENSION) throw new Error(`Invalid tile dimension '${tileDimension}' for resource '${resourceName}'`);

  return {
    signature: 'tis',
    version: 'v1',
    tileCount,
    tileSize,
    headerSize,
    tileDimension,
  };
};
