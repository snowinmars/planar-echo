import { isNothing, nothing, PASSABLE_WALK } from '@planar/shared';

import type { Maybe, Point, WalkGrid } from '@planar/shared';

/**
 * Flat index of a cell in walk.grid.
 */
export const cellIndex = (grid: WalkGrid, cell: Point): number => cell.y * grid.colsCount + cell.x;

/**
 * Whether a cell is inside the grid rectangle.
 */
export const inBounds = (grid: WalkGrid, cell: Point): boolean => (
  cell.x >= 0 && cell.y >= 0 && cell.x < grid.colsCount && cell.y < grid.rowsCount
);

/**
 * Whether a cell can be stepped on (in bounds and passable).
 */
export const isPassable = (walk: WalkGrid, cell: Point): boolean => {
  if (!inBounds(walk, cell)) return false;

  const flag = walk.grid[cellIndex(walk, cell)];

  if (isNothing(flag)) return false;

  return (flag & PASSABLE_WALK) === PASSABLE_WALK;
};

/**
 * World pixels -> cell coordinates.
 */
export const worldPxToCellPx = (grid: WalkGrid, point: Point): Point => ({
  x: Math.floor(point.x / grid.cellWidth),
  y: Math.floor(point.y / grid.cellHeight),
});

/**
 * Cell coordinates -> world pixels at the cell center.
 */
export const cellPxToWorldPx = (grid: WalkGrid, cell: Point): Point => ({
  x: cell.x * grid.cellWidth + Math.floor(grid.cellWidth / 2),
  y: cell.y * grid.cellHeight + Math.floor(grid.cellHeight / 2),
});

/**
 * Cell -> string key for Set/Map.
 */
export const cellKey = (cell: Point): string => `${cell.x},${cell.y}`;

/**
 * Same WalkGrid metadata, different Uint8Array buffer.
 */
type Walk = Pick<WalkGrid, 'cellWidth' | 'cellHeight' | 'colsCount' | 'rowsCount'>;
export const rewriteWalkGrid = (walk: Walk, grid: Uint8Array): WalkGrid => ({
  cellWidth: walk.cellWidth,
  cellHeight: walk.cellHeight,
  colsCount: walk.colsCount,
  rowsCount: walk.rowsCount,
  grid,
});

/**
 * First passable cell center in the area.
 */
export const firstPassableCenter = (grid: WalkGrid): Maybe<Point> => {
  for (let y = 0; y < grid.rowsCount; y += 1) {
    for (let x = 0; x < grid.colsCount; x += 1) {
      const cell = { x, y };
      if (!inBounds(grid, cell) || !isPassable(grid, cell)) continue;

      return cellPxToWorldPx(grid, cell);
    }
  }

  return nothing();
};

/**
 * Update one cell when its walkability changes (door, script, editor).
 * `walk.grid[cell]` is a flags byte: PASSABLE_WALK is 'floor', 0 is 'wall', out of bounds is a no-op.
 *   `or` turns bits on
 *   `and` turns bits off (mask)
 *   `set` replaces the byte.
 * Not for per-tick actor footprints.
 */
export const paintCell = (
  walk: WalkGrid,
  cell: Point,
  bits: number,
  mode: 'or' | 'and' | 'set',
): void => {
  if (!inBounds(walk, cell)) return;

  const i = cellIndex(walk, cell);
  const prev = walk.grid[i]!;

  walk.grid[i] = mode === 'or'
    ? (prev | bits)
    : mode === 'and'
      ? (prev & bits)
      : bits;
};

/**
 * Whether a point is inside a polygon (doors, travel regions).
 */
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
