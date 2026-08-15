import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawWedHeader } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader): RawWedHeader => {
  const header: RawWedHeader = {
    signature: 'wed',
    version: 'v1.3',
    overlaysCount: reader.uint(),
    doorsCount: reader.uint(),
    overlaysOffset: reader.uint(),
    secondaryHeaderOffset: reader.uint(),
    doorsOffset: reader.uint(),
    doorsTileCellsOffset: reader.uint(),
  };

  return header;
};
