import { parsePolygons } from './5.parsePolygons.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawWedDoor } from './6.parseDoors.types.js';

type ParseDoorProps = Readonly<{
  reader: BufferReader;
  doorsTileCellsOffset: number;
}>;
const parseDoor = ({
  reader,
  doorsTileCellsOffset,
}: ParseDoorProps): RawWedDoor => {
  const name = reader.string(8);
  const isOpen = reader.ushort() === 0; // yes: open is 0 / closed is 1
  const firstDoorTileCellIndex = reader.ushort();
  const doorTileCellCount = reader.ushort();
  const openPolygonCount = reader.ushort();
  const closedPolygonCount = reader.ushort();
  const openPolygonsOffset = reader.uint();
  const closedPolygonsOffset = reader.uint();

  const doorTileCells: number[] = [];
  const sizeOfCellInBytes = 2; // from NearInfinity
  const cellReader = reader.fork(doorsTileCellsOffset + firstDoorTileCellIndex * sizeOfCellInBytes);
  for (let i = 0; i < doorTileCellCount; i++) {
    const doorTileCell = cellReader.ushort();
    doorTileCells.push(doorTileCell);
  }

  const openPolygons = parsePolygons({
    reader: reader.fork(openPolygonsOffset),
    count: openPolygonCount,
  });

  const closedPolygons = parsePolygons({
    reader: reader.fork(closedPolygonsOffset),
    count: closedPolygonCount,
  });

  return {
    name,
    isOpen,
    firstDoorTileCellIndex,
    doorTileCellCount,
    openPolygonCount,
    closedPolygonCount,
    openPolygonsOffset,
    closedPolygonsOffset,
    doorTileCells,
    openPolygons,
    closedPolygons,
  };
};

type ParseDoorsProps = Readonly<{
  reader: BufferReader;
  count: number;
  doorsTileCellsOffset: number;
}>;
export const parseDoors = ({
  reader,
  count,
  doorsTileCellsOffset,
}: ParseDoorsProps) => {
  const doors: RawWedDoor[] = [];

  for (let i = 0; i < count; i++) {
    doors.push(parseDoor({
      reader,
      doorsTileCellsOffset,
    }));
  }

  return doors;
};
