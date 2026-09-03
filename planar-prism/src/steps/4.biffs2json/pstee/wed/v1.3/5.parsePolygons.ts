import { extendMap } from './5.parsePolygons.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawWedPolygon } from './5.parsePolygons.types.js';

const parsePolygon = (reader: BufferReader): RawWedPolygon => {
  const vertexStartingIndex = reader.uint();
  const vertexCount = reader.uint();
  const flags = reader.map.ubyte(extendMap.flags.parseFlags);
  const height = reader.ubyte();
  const minX = reader.short();
  const maxX = reader.short();
  const minY = reader.short();
  const maxY = reader.short();

  return {
    vertexStartingIndex,
    vertexCount,
    flags,
    height,
    minX,
    maxX,
    minY,
    maxY,
  };
};

type ParsePolygonsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parsePolygons = ({
  reader,
  count,
}: ParsePolygonsProps): RawWedPolygon[] => {
  const wallPolygons: RawWedPolygon[] = [];

  for (let i = 0; i < count; i++) {
    const wallPolygon = parsePolygon(reader);
    wallPolygons.push(wallPolygon);
  }

  return wallPolygons;
};
