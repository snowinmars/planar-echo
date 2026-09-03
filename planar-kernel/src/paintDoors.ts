import { cellIndex, inBounds } from './cell.js';

import type { GhostAreDoor } from '@planar/shared';

import type { WalkGrid, World } from './types.js';

export const paintDoorFlags = (
  walkBase: Uint8Array,
  size: Readonly<{ colsCount: number; rowsCount: number }>,
  doors: Iterable<GhostAreDoor>,
  doorOpen: ReadonlyMap<string, boolean>,
): Uint8Array => {
  const grid = Uint8Array.from(walkBase);
  const walk: WalkGrid = {
    cellWidth: 1,
    cellHeight: 1,
    colsCount: size.colsCount,
    rowsCount: size.rowsCount,
    grid,
  };

  for (const door of doors) {
    const id = door.doorId;
    const open = doorOpen.get(id) ?? false;
    const cells = open ? door.openedGeometry.impeded : door.closedGeometry.impeded;

    for (const cell of cells) {
      if (!inBounds(walk, cell)) throw new Error(`Cell is out of bounds: '${JSON.stringify(walk)}', '${JSON.stringify(cell)}'`);
      const index = cellIndex(walk, cell);
      grid[index] = 0;
    }
  }

  return grid;
};

export const paintAllDoors = (world: World): void => {
  world.walkGrid.grid.set(paintDoorFlags(
    world.walkBase,
    world.walkGrid,
    world.doors.values(),
    world.doorOpen,
  ));
};
