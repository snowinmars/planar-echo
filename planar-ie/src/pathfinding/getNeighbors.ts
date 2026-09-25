import { isPassable } from '../cellMath.js';

import type { Point } from '@planar/shared';

import type { WalkGrid } from '../walkGrid.js';

const NEIGHBORS: Point[] = [
  { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
  { x: -1, y: 0 }, /*           */ { x: 1, y: 0 },
  { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
];

const canStep = (grid: WalkGrid, from: Point, delta: Point): boolean => {
  const to: Point = { x: from.x + delta.x, y: from.y + delta.y };
  if (!isPassable(grid, to)) return false;

  if (delta.x !== 0 && delta.y !== 0) {
    const horizontal: Point = { x: from.x + delta.x, y: from.y };
    const vertical: Point = { x: from.x, y: from.y + delta.y };
    if (!isPassable(grid, horizontal) || !isPassable(grid, vertical)) {
      return false;
    }
  }

  return true;
};

export const getNeighbors = (grid: WalkGrid, from: Point): Point[] => (
  NEIGHBORS
    .filter(delta => canStep(grid, from, delta))
    .map(delta => ({ x: from.x + delta.x, y: from.y + delta.y }))
);
