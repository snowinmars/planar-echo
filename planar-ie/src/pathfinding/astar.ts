import { nothing } from '@planar/shared';

import { cellKey, inBounds } from '../cellMath.js';
import { getNeighbors } from './getNeighbors.js';

import type { Maybe, Point } from '@planar/shared';

import type { WalkGrid } from '../walkGrid.js';

const chebyshev = (a: Point, b: Point): number => (
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
);

type Node = Readonly<{
  cell: Point;
  g: number;
  f: number;
  parent: Maybe<Node>;
}>;

export const astar = (grid: WalkGrid, start: Point, goal: Point): Point[] => {
  if (!inBounds(grid, start) || !inBounds(grid, goal)) return [];

  const open: Node[] = [{
    cell: start,
    g: 0,
    f: chebyshev(start, goal),
    parent: nothing(),
  }];
  const bestG = new Map<string, number>([[cellKey(start), 0]]);

  while (open.length > 0) {
    let bestIndex = 0;
    let bestNode = open[0];
    if (!bestNode) break;

    for (let i = 1; i < open.length; i += 1) {
      const candidate = open[i];
      if (!candidate) continue;
      if (candidate.f < bestNode.f) {
        bestNode = candidate;
        bestIndex = i;
      }
    }

    open.splice(bestIndex, 1);
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
      const previous = bestG.get(key);
      if (previous !== undefined && previous <= g) continue;

      bestG.set(key, g);
      open.push({
        cell: next,
        g,
        f: g + chebyshev(next, goal),
        parent: bestNode,
      });
    }
  }

  return [];
};
