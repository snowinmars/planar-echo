import type { BufferReader } from '@/shared/bufferReader.js';
import type { WedSecondaryHeader } from './3.parseSecondaryHeader.types.js';

export const parseSecondaryHeader = (reader: BufferReader): WedSecondaryHeader => {
  const secondaryHeader: WedSecondaryHeader = {
    wallPolygonCount: reader.uint(),
    polygonsOffset: reader.uint(),
    verticesOffset: reader.uint(),
    wallGroupsOffset: reader.uint(),
    polygonIndicesLookupTableOffset: reader.uint(),
  };

  return secondaryHeader;
};
