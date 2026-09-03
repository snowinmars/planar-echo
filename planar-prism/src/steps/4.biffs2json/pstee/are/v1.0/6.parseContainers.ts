import { nothing } from '@planar/shared';

import { extendMap } from './6.parseContainers.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawAreContainerV10 } from './6.parseContainers.types.js';
import type { RawAreItemV10 } from './7.parseItems.types.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';

type ParseContainerProps = Readonly<{
  reader: BufferReader;
  items: readonly RawAreItemV10[];
  vertices: readonly RawAreVertexV10[];
}>;
const parseContainer = ({
  reader,
  items,
  vertices,
}: ParseContainerProps): RawAreContainerV10 => {
  const name = reader.nullTerminatedString(32);
  const x = reader.ushort();
  const y = reader.ushort();
  const type = reader.map.ushort(extendMap.containerType.parse);
  const lockDifficulty = reader.ushort();
  const flags = reader.map.uint(extendMap.containerFlags.parseFlags);
  const trapDetectionDifficulty = reader.ushort();
  const trapRemovalDifficulty = reader.ushort();
  const trapped = reader.ushort() === 1;
  const trapDetected = reader.ushort() === 1;
  const launchX = reader.ushort();
  const launchY = reader.ushort();
  const boundingBoxLeft = reader.short();
  const boundingBoxTop = reader.short();
  const boundingBoxRight = reader.short();
  const boundingBoxBottom = reader.short();
  const firstItemIndex = reader.uint();
  const itemsCount = reader.uint();
  const trapScript = reader.string(8);
  const firstVertexIndex = reader.uint();
  const verticesCount = reader.ushort();
  const triggerRange = reader.ushort();
  const owner = reader.string(32);
  const key = reader.string(8);
  const breakDifficulty = reader.uint();
  const lockpickStringRef = reader.int();
  reader.skip.custom(56);

  const itemsSlice = items.slice(firstItemIndex, firstItemIndex + itemsCount);
  const verticesSlice = vertices.slice(firstVertexIndex, firstVertexIndex + verticesCount);

  const rawAreContainerV10: RawAreContainerV10 = {
    name,
    at: {
      x,
      y,
    },
    type,
    lockDifficulty,
    flags,
    trapDetectionDifficulty,
    trapRemovalDifficulty,
    trapped,
    trapDetected,
    launch: {
      x: launchX,
      y: launchY,
    },
    boundingBox: {
      left: boundingBoxLeft,
      top: boundingBoxTop,
      right: boundingBoxRight,
      bottom: boundingBoxBottom,
    },
    items: itemsSlice,
    trapScript: trapScript ? trapScript : nothing(),
    vertices: verticesSlice,
    triggerRange,
    owner: owner ? owner : nothing(),
    key: key ? key : nothing(),
    breakDifficulty,
    lockpickStringRef,
  };

  return rawAreContainerV10;
};

type ParseContainersProps = Readonly<{
  reader: BufferReader;
  count: number;
  items: RawAreItemV10[];
  vertices: RawAreVertexV10[];
}>;
export const parseContainers = ({
  reader,
  count,
  items,
  vertices,
}: ParseContainersProps): RawAreContainerV10[] => {
  const containers: RawAreContainerV10[] = [];

  for (let i = 0; i < count; i++) containers.push(parseContainer({
    reader,
    items,
    vertices,
  }));

  return containers;
};
