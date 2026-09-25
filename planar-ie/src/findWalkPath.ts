import {
  cellPxToWorldPx,
  worldPxToCellPx,
} from './cellMath.js';
import { astar } from './pathfinding/astar.js';

import type { Point } from '@planar/shared';

import type { WalkGrid } from './walkGrid.js';

export const findWalkPath = (
  fromWorldPoint: Point,
  toWorldPoint: Point,
  grid: WalkGrid,
): Point[] => (
  astar(
    grid,
    worldPxToCellPx(grid, fromWorldPoint),
    worldPxToCellPx(grid, toWorldPoint),
  ).map(cell => cellPxToWorldPx(grid, cell))
);
