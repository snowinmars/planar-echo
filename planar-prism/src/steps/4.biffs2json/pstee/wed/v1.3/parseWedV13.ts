import { parseHeader } from './1.parseHeader.js';
import { parseOverlays } from './2.parseOverlay.js';
import { parseSecondaryHeader } from './3.parseSecondaryHeader.js';
import { parseVertices } from './4.parseVertices.js';
import { parsePolygons } from './5.parsePolygons.js';
import { parseDoors } from './6.parseDoors.js';
import { parseWallGroups } from './7.parseWallGroups.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawWed } from '../parseWeds.types.js';
import type { RawWedVertex } from './4.parseVertices.types.js';

type ParseWedV13Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseWedV13 = ({
  reader,
  resourceName,
}: ParseWedV13Props): RawWed => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/wed_v1.3.htm
  const header = parseHeader(reader);

  const overlays = parseOverlays({
    reader: reader.fork(header.overlaysOffset),
    count: header.overlaysCount,
  });

  const secondaryHeader = parseSecondaryHeader(reader.fork(header.secondaryHeaderOffset));

  // each vertex is (x,y)
  // x and y are little-endian 16-bit integer
  // so each vertex is 32 bits = 4 bytes
  const sizeOfVertexInBytes = 4;
  const verticesTailLength = reader.length - secondaryHeader.verticesOffset;
  if (verticesTailLength % sizeOfVertexInBytes) throw new Error(`Broken vertices for resource '${resourceName}'`);
  const verticesCount = (reader.length - secondaryHeader.verticesOffset) / sizeOfVertexInBytes;
  const vertices: RawWedVertex[] = parseVertices({
    reader: reader.fork(secondaryHeader.verticesOffset),
    count: verticesCount,
  });

  const wallPolygons = parsePolygons({
    reader: reader.fork(secondaryHeader.polygonsOffset),
    count: secondaryHeader.wallPolygonCount,
  });

  const doors = parseDoors({
    reader: reader.fork(header.doorsOffset),
    count: header.doorsCount,
    doorsTileCellsOffset: header.doorsTileCellsOffset,
  });

  const anyOverlay = overlays[0];
  if (!anyOverlay) throw new Error(`WED '${resourceName}' should have overlays for wall groups`);
  const wallGroupCount = Math.ceil(anyOverlay.width / 10) * Math.ceil((anyOverlay.height) / 7.5); // from docs

  const { wallGroups, polygonIndicesLookupTable } = parseWallGroups({
    reader: reader.fork(secondaryHeader.wallGroupsOffset),
    count: wallGroupCount,
    polygonIndicesLookupTableOffset: secondaryHeader.polygonIndicesLookupTableOffset,
  });

  return {
    resourceName,
    header,
    overlays,
    secondaryHeader,
    vertices,
    wallPolygons,
    doors,
    wallGroups,
    polygonIndicesLookupTable,
  };
};
