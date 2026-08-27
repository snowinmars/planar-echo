import { nothing } from '@planar/shared';
import { cellKey, inBounds, isPassable } from './cell.js';

import type { Point, WalkGrid } from './types.js';
import type { Maybe } from '@planar/shared';

/**
 * Mostly llm-generated
 */

const NEIGHBORS: Point[] = [
  { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 },
  { x: -1, y: 0 }, /* ......... */ { x: 1, y: 0 },
  { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
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

const neighbors = (grid: WalkGrid, from: Point): Point[] => (
  NEIGHBORS
    .filter(delta => canStep(grid, from, delta))
    .map(delta => ({ x: from.x + delta.x, y: from.y + delta.y }))
);

export const reachableFrom = (grid: WalkGrid, start: Point): Set<string> => {
  const seen = new Set<string>([cellKey(start)]);
  const queue: Point[] = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    for (const next of neighbors(grid, current)) {
      const key = cellKey(next);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push(next);
    }
  }

  return seen;
};

const chebyshev = (a: Point, b: Point): number => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

export const closestReachable = (reachable: Set<string>, dest: Point): Maybe<Point> => {
  let best: Maybe<Point> = nothing();
  let bestScore = Number.POSITIVE_INFINITY;

  for (const key of reachable) {
    const [xRaw, yRaw] = key.split(',');
    const x = Number(xRaw);
    const y = Number(yRaw);
    const cell: Point = { x, y };
    const score = (cell.x - dest.x) ** 2 + (cell.y - dest.y) ** 2;

    if (score < bestScore) {
      bestScore = score;
      best = cell;
      continue;
    }

    if (score === bestScore && best) {
      if (cell.y < best.y || (cell.y === best.y && cell.x < best.x)) {
        best = cell;
      }
    }
  }

  return best;
};

type Node = Readonly<{
  cell: Point;
  g: number;
  f: number;
  parent: Maybe<Node>;
}>;
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

    for (const next of neighbors(grid, bestNode.cell)) {
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
