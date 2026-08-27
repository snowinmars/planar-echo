import { cellIndex, inBounds } from './cell.js';

import type { Point, WalkGrid } from './types.js';

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
