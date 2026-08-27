import { extendMap } from './14.parseTiledObjects.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreTiledObjectV10 } from './14.parseTiledObjects.types.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';

type ParseTiledObjectProps = Readonly<{
  reader: BufferReader;
  vertices: readonly RawAreVertexV10[];
}>;
const parseTiledObject = ({
  reader,
  vertices,
}: ParseTiledObjectProps): RawAreTiledObjectV10 => {
  const name = reader.nullTerminatedString(32);
  const tileId = reader.string(8);
  const flags = reader.map.uint(extendMap.tiledObjectFlags.parseFlags);
  const firstImpededIndexWhenOpened = reader.uint();
  const impededCountWhenOpened = reader.ushort();
  const impededCountWhenClosed = reader.ushort();
  const firstImpededIndexWhenClosed = reader.uint();
  reader.skip.custom(48);

  const openImpededSlice = vertices.slice(firstImpededIndexWhenOpened, firstImpededIndexWhenOpened + impededCountWhenOpened);
  const closedImpededSlice = vertices.slice(firstImpededIndexWhenClosed, firstImpededIndexWhenClosed + impededCountWhenClosed);

  const rawAreTiledObjectV10: RawAreTiledObjectV10 = {
    name,
    tileId,
    flags,
    openImpeded: openImpededSlice,
    closedImpeded: closedImpededSlice,
  };

  return rawAreTiledObjectV10;
};

type ParseTiledObjectsProps = Readonly<{
  reader: BufferReader;
  count: number;
  vertices: readonly RawAreVertexV10[];
}>;
export const parseTiledObjects = ({
  reader,
  count,
  vertices,
}: ParseTiledObjectsProps): RawAreTiledObjectV10[] => {
  const tiledObjects: RawAreTiledObjectV10[] = [];

  for (let i = 0; i < count; i++) tiledObjects.push(parseTiledObject({
    reader,
    vertices,
  }));

  return tiledObjects;
};
