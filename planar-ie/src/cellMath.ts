import { isNothing, nothing } from '@planar/shared';

import { PASSABLE_WALK } from './walkGrid.js';

import type { Maybe, Point } from '@planar/shared';

import type { WalkGrid } from './walkGrid.js';

export const cellIndex = (grid: WalkGrid, cell: Point): number => (
  cell.y * grid.colsCount + cell.x
);

export const inBounds = (grid: WalkGrid, cell: Point): boolean => (
  cell.x >= 0
  && cell.y >= 0
  && cell.x < grid.colsCount
  && cell.y < grid.rowsCount
);

export const isPassable = (walk: WalkGrid, cell: Point): boolean => {
  if (!inBounds(walk, cell)) return false;

  const flag = walk.grid[cellIndex(walk, cell)];
  if (isNothing(flag)) return false;
  return (flag & PASSABLE_WALK) === PASSABLE_WALK;
};

export const worldPxToCellPx = (grid: WalkGrid, point: Point): Point => ({
  x: Math.floor(point.x / grid.cellWidth),
  y: Math.floor(point.y / grid.cellHeight),
});

export const cellPxToWorldPx = (grid: WalkGrid, cell: Point): Point => ({
  x: cell.x * grid.cellWidth + Math.floor(grid.cellWidth / 2),
  y: cell.y * grid.cellHeight + Math.floor(grid.cellHeight / 2),
});

export const cellKey = (cell: Point): string => `${cell.x},${cell.y}`;

type WalkGridShape = Pick<
  WalkGrid,
  'cellWidth' | 'cellHeight' | 'colsCount' | 'rowsCount'
>;

export const rewriteWalkGrid = (
  walk: WalkGridShape,
  grid: Uint8Array,
): WalkGrid => ({
  cellWidth: walk.cellWidth,
  cellHeight: walk.cellHeight,
  colsCount: walk.colsCount,
  rowsCount: walk.rowsCount,
  grid,
});

export const firstPassableCenter = (grid: WalkGrid): Maybe<Point> => {
  for (let y = 0; y < grid.rowsCount; y += 1) {
    for (let x = 0; x < grid.colsCount; x += 1) {
      const cell = { x, y };
      if (!isPassable(grid, cell)) continue;
      return cellPxToWorldPx(grid, cell);
    }
  }

  return nothing();
};

export const paintCell = (
  walk: WalkGrid,
  cell: Point,
  bits: number,
  mode: 'or' | 'and' | 'set',
): void => {
  if (!inBounds(walk, cell)) return;

  const index = cellIndex(walk, cell);
  const previous = walk.grid[index]!;
  walk.grid[index] = mode === 'or'
    ? (previous | bits)
    : mode === 'and'
      ? (previous & bits)
      : bits;
};

export const pointInPoly = (point: Point, poly: Point[]): boolean => {
  if (poly.length < 3) return false;

  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const a = poly[i];
    const b = poly[j];
    if (!a || !b) continue;

    const crosses = (a.y > point.y) !== (b.y > point.y);
    if (!crosses) continue;

    const dy = b.y - a.y;
    if (dy === 0) continue;

    const xAt = ((b.x - a.x) * (point.y - a.y)) / dy + a.x;
    if (point.x < xAt) inside = !inside;
  }

  return inside;
};
