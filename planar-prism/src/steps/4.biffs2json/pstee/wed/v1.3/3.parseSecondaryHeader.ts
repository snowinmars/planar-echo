import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawWedSecondaryHeader } from './3.parseSecondaryHeader.types.js';

export const parseSecondaryHeader = (reader: BufferReader): RawWedSecondaryHeader => {
  const secondaryHeader: RawWedSecondaryHeader = {
    wallPolygonCount: reader.uint(),
    polygonsOffset: reader.uint(),
    verticesOffset: reader.uint(),
    wallGroupsOffset: reader.uint(),
    polygonIndicesLookupTableOffset: reader.uint(),
  };

  return secondaryHeader;
};
