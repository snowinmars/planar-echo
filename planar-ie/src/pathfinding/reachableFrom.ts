import { cellKey } from '../cellMath.js';
import { getNeighbors } from './getNeighbors.js';

import type { Point } from '@planar/shared';

import type { WalkGrid } from '../walkGrid.js';

export const reachableFrom = (grid: WalkGrid, start: Point): Set<string> => {
  const seen = new Set<string>([cellKey(start)]);
  const queue: Point[] = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    for (const next of getNeighbors(grid, current)) {
      const key = cellKey(next);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push(next);
    }
  }

  return seen;
};
