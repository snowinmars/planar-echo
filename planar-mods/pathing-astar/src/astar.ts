import { cellKey, inBounds } from '@planar/kernel';
import { nothing } from '@planar/shared';

import { getNeighbors } from './getNeighbors.js';

import type { Maybe, Point, WalkGrid } from '@planar/shared';

const chebyshev = (a: Point, b: Point): number => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

type Node = Readonly<{
  cell: Point;
  g: number;
  f: number;
  parent: Maybe<Node>;
}>;

/**
 * Cell sequence start -> goal. Empty if no path.
 */
export const astar = (grid: WalkGrid, start: Point, goal: Point): Point[] => {
  if (!inBounds(grid, start) || !inBounds(grid, goal)) return [];

  const open: Node[] = [{ cell: start, g: 0, f: chebyshev(start, goal), parent: nothing() }];
  const bestG = new Map<string, number>([[cellKey(start), 0]]);

  while (open.length > 0) {
    let bestI = 0;
    let bestNode = open[0];
    if (!bestNode) break;

    for (let i = 1; i < open.length; i += 1) {
      const candidate = open[i];
      if (!candidate) continue;
      if (candidate.f < bestNode.f) {
        bestNode = candidate;
        bestI = i;
      }
    }

    open.splice(bestI, 1);

    if (bestNode.cell.x === goal.x && bestNode.cell.y === goal.y) {
      const path: Point[] = [];
      let cursor: Maybe<Node> = bestNode;

      while (cursor) {
        path.push(cursor.cell);
        cursor = cursor.parent;
      }

      return path.reverse();
    }

    for (const next of getNeighbors(grid, bestNode.cell)) {
      const g = bestNode.g + 1;
      const key = cellKey(next);
      const prevG = bestG.get(key);

      if (prevG !== undefined && prevG <= g) continue;

      bestG.set(key, g);
      open.push({ cell: next, g, f: g + chebyshev(next, goal), parent: bestNode });
    }
  }

  return [];
};
