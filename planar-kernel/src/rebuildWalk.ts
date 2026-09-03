import { paintDoorFlags } from './paintDoors.js';
import { paintOccupancy } from './paintOccupancy.js';

import type { EntityId, WalkGrid, World } from './types.js';

const occupancyGrid = (world: World, ignoreId?: EntityId): Uint8Array => {
  const grid = paintDoorFlags(
    world.walkBase,
    world.walkGrid,
    world.doors.values(),
    world.doorOpen,
  );
  paintOccupancy(grid, world.walkGrid, world.bodies, world.actors, ignoreId);
  return grid;
};

export const rebuildWalk = (world: World): void => {
  world.walkGrid.grid.set(occupancyGrid(world));
};

export const walkGridForPath = (world: World, ignoreId: EntityId): WalkGrid => ({
  cellWidth: world.walkGrid.cellWidth,
  cellHeight: world.walkGrid.cellHeight,
  colsCount: world.walkGrid.colsCount,
  rowsCount: world.walkGrid.rowsCount,
  grid: occupancyGrid(world, ignoreId),
});
