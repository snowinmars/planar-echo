import { paintCell } from './paintCell.js';

import type { ApplyResult, Point, World } from './types.js';

export const paintWalk = (
  world: World,
  cells: Point[],
  bits: number,
  mode: 'or' | 'and' | 'set',
): ApplyResult => {
  for (const cell of cells) {
    paintCell(world.walkGrid, cell, bits, mode);
  }

  return { events: [] };
};
