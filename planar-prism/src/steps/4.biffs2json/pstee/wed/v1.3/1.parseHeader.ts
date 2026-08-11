import type { BufferReader } from '@/shared/bufferReader.js';
import type { WedHeader } from './1.parseHeader.types.js';

export const parseHeader = (reader: BufferReader): WedHeader => {
  const header: WedHeader = {
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
