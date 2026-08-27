import { isNothing } from '@planar/shared';
import { PASSABLE_WALK } from './types.js';

import type { WalkGrid, Point } from './types.js';

export const cellIndex = (grid: WalkGrid, cell: Point): number => cell.y * grid.colsCount + cell.x;

export const inBounds = (grid: WalkGrid, cell: Point): boolean => (
  cell.x >= 0 && cell.y >= 0 && cell.x < grid.colsCount && cell.y < grid.rowsCount
);

export const isPassable = (walk: WalkGrid, cell: Point): boolean => {
  if (!inBounds(walk, cell)) return false;

  const flag = walk.grid[cellIndex(walk, cell)];

  if (isNothing(flag)) return false;

  return (flag & PASSABLE_WALK) === PASSABLE_WALK;
};

export const worldToCell = (grid: WalkGrid, point: Point): Point => ({
  x: Math.floor(point.x / grid.cellWidth),
  y: Math.floor(point.y / grid.cellHeight),
});

export const cellCenter = (grid: WalkGrid, cell: Point): Point => ({
  x: cell.x * grid.cellWidth + Math.floor(grid.cellWidth / 2),
  y: cell.y * grid.cellHeight + Math.floor(grid.cellHeight / 2),
});

export const cellKey = (cell: Point): string => `${cell.x},${cell.y}`;
