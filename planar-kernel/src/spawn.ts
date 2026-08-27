import { nothing } from '@planar/shared';
import { cellCenter, inBounds, isPassable } from './cell.js';

import type { WalkGrid, Point } from './types.js';
import type { Maybe } from '@planar/shared';

export const firstPassableCenter = (grid: WalkGrid): Maybe<Point> => {
  for (let y = 0; y < grid.rowsCount; y += 1) {
    for (let x = 0; x < grid.colsCount; x += 1) {
      const cell = { x, y };
      if (!inBounds(grid, cell) || !isPassable(grid, cell)) continue;

      return cellCenter(grid, cell);
    }
  }

  return nothing();
};
