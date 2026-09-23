import { isPassable } from '@planar/kernel';

import type { Point, WalkGrid } from '@planar/shared';

const NEIGHBORS: Point[] = [
  { x: -1, y: 1 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
];

const canStep = (grid: WalkGrid, from: Point, delta: Point): boolean => {
  const to: Point = { x: from.x + delta.x, y: from.y + delta.y };

  if (!isPassable(grid, to)) return false;

  if (delta.x !== 0 && delta.y !== 0) {
    const orthoA: Point = { x: from.x + delta.x, y: from.y };
    const orthoB: Point = { x: from.x, y: from.y + delta.y };

    if (!isPassable(grid, orthoA) || !isPassable(grid, orthoB)) return false;
  }

  return true;
};

export const getNeighbors = (grid: WalkGrid, from: Point): Point[] => (
  NEIGHBORS
    .filter(delta => canStep(grid, from, delta))
    .map(delta => ({ x: from.x + delta.x, y: from.y + delta.y }))
);
