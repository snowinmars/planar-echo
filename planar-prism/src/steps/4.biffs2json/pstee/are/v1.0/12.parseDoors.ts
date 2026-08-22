import { extendMap } from './12.parseDoors.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreDoorV10 } from './12.parseDoors.types.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';
import { nothing } from '@planar/shared';

type ParseDoorProps = Readonly<{
  reader: BufferReader;
  vertices: RawAreVertexV10[];
}>;
const parseDoor = ({
  reader,
  vertices,
}: ParseDoorProps): RawAreDoorV10 => {
  const name = reader.nullTerminatedString(32); // TODO [snow]: in bytecode there is tail after null terminator. Why?
  const doorId = reader.string(8);
  const flags = reader.map.uint(extendMap.doorFlags.parseFlags);
  const firstVertexIndexWhenOpened = reader.uint();
  const verticesCountWhenOpened = reader.ushort();
  const verticesCountWhenClosed = reader.ushort();
  const firstVertexIndexWhenClosed = reader.uint();
  const boundingBoxLeftWhenOpened = reader.short();
  const boundingBoxTopWhenOpened = reader.short();
  const boundingBoxRightWhenOpened = reader.short();
  const boundingBoxBottomWhenOpened = reader.short();
  const boundingBoxLeftWhenClosed = reader.short();
  const boundingBoxTopWhenClosed = reader.short();
  const boundingBoxRightWhenClosed = reader.short();
  const boundingBoxBottomWhenClosed = reader.short();
  const firstImpededIndexWhenOpened = reader.uint();
  const impededCountWhenOpened = reader.ushort();
  const impededCountWhenClosed = reader.ushort();
  const firstImpededIndexWhenClosed = reader.uint();
  const hitPoints = reader.short();
  const armorClass = reader.ushort();
  const openSound = reader.string(8);
  const closeSound = reader.string(8);
  const cursorIndex = reader.uint();
  const trapDetectionDifficulty = reader.ushort();
  const trapRemovalDifficulty = reader.ushort();
  const trapped = reader.ushort() === 1;
  const trapDetected = reader.ushort() === 1;
  const trapLaunchX = reader.ushort();
  const trapLaunchY = reader.ushort();
  const key = reader.string(8);
  const script = reader.string(8);
  const detectionDifficulty = reader.uint();
  const lockDifficulty = reader.uint();
  const openLocationX = reader.ushort();
  const openLocationY = reader.ushort();
  const closeLocationX = reader.ushort();
  const closeLocationY = reader.ushort();
  const lockpickStringRef = reader.int();
  const travelTriggerName = reader.string(24);
  const speakerNameRef = reader.int();
  const dialog = reader.string(8);
  reader.skip.custom(8);

  const openVerticesSlice = vertices.slice(firstVertexIndexWhenOpened, firstVertexIndexWhenOpened + verticesCountWhenOpened);
  const closedVerticesSlice = vertices.slice(firstVertexIndexWhenClosed, firstVertexIndexWhenClosed + verticesCountWhenClosed);
  const openImpededSlice = vertices.slice(firstImpededIndexWhenOpened, firstImpededIndexWhenOpened + impededCountWhenOpened);
  const closedImpededSlice = vertices.slice(firstImpededIndexWhenClosed, firstImpededIndexWhenClosed + impededCountWhenClosed);

  const rawAreDoorV10: RawAreDoorV10 = {
    name,
    doorId,
    flags,
    openedGeometry: {
      boundingBox: {
        left: boundingBoxLeftWhenOpened,
        top: boundingBoxTopWhenOpened,
        right: boundingBoxRightWhenOpened,
        bottom: boundingBoxBottomWhenOpened,
      },
      vertices: openVerticesSlice,
      impeded: openImpededSlice,
    },
    closedGeometry: {
      boundingBox: {
        left: boundingBoxLeftWhenClosed,
        top: boundingBoxTopWhenClosed,
        right: boundingBoxRightWhenClosed,
        bottom: boundingBoxBottomWhenClosed,
      },
      vertices: closedVerticesSlice,
      impeded: closedImpededSlice,
    },
    hitPoints,
    armorClass,
    openSound: openSound ? openSound : nothing(),
    closeSound: closeSound ? closeSound : nothing(),
    cursorIndex,
    trapDetectionDifficulty,
    trapRemovalDifficulty,
    trapped,
    trapDetected,
    launch: {
      x: trapLaunchX,
      y: trapLaunchY,
    },
    key: key ? key : nothing(),
    script: script ? script : nothing(),
    detectionDifficulty,
    lockDifficulty,
    openLocation: {
      x: openLocationX,
      y: openLocationY,
    },
    closeLocation: {
      x: closeLocationX,
      y: closeLocationY,
    },
    lockpickStringRef: lockpickStringRef ? lockpickStringRef : nothing(),
    travelTriggerName: travelTriggerName ? travelTriggerName : nothing(),
    speakerNameRef: speakerNameRef ? speakerNameRef : nothing(),
    dialog: dialog ? dialog : nothing(),
  };

  return rawAreDoorV10;
};

type ParseDoorsProps = Readonly<{
  reader: BufferReader;
  count: number;
  vertices: RawAreVertexV10[];
}>;
export const parseDoors = ({
  reader,
  count,
  vertices,
}: ParseDoorsProps): RawAreDoorV10[] => {
  const doors: RawAreDoorV10[] = [];

  for (let i = 0; i < count; i++) doors.push(parseDoor({
    reader,
    vertices,
  }));

  return doors;
};
