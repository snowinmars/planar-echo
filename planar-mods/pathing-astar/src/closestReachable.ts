import { nothing } from '@planar/shared';

import type { Maybe, Point } from '@planar/shared';

/**
 * Closest reachable cell to destination (when the destination is blocked).
 */
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
