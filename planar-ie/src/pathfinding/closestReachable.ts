import { nothing } from '@planar/shared';

import type { Maybe, Point } from '@planar/shared';

export const closestReachable = (
  reachable: Set<string>,
  destination: Point,
): Maybe<Point> => {
  let best: Maybe<Point> = nothing();
  let bestScore = Number.POSITIVE_INFINITY;

  for (const key of reachable) {
    const [xRaw, yRaw] = key.split(',');
    const cell: Point = {
      x: Number(xRaw),
      y: Number(yRaw),
    };
    const score = (
      (cell.x - destination.x) ** 2
      + (cell.y - destination.y) ** 2
    );

    if (score < bestScore) {
      bestScore = score;
      best = cell;
      continue;
    }

    if (
      score === bestScore
      && best
      && (cell.y < best.y || (cell.y === best.y && cell.x < best.x))
    ) {
      best = cell;
    }
  }

  return best;
};
