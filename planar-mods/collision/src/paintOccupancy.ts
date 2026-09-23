import { inBounds, worldPxToCellPx } from '@planar/kernel';
import { MAX_PERSONAL_SPACE } from '@planar/shared';

import type { EntityId, Envelope, Point, WalkGrid } from '@planar/shared';

const clampPersonalSpace = (personalSpace: number): number => (
  Math.min(MAX_PERSONAL_SPACE, Math.max(1, personalSpace))
);

/**
 * Cells under other actors so pathfinding walks around them. Skips `ignoreId` (the mover).
 */
export const paintOccupancy = (
  walk: WalkGrid,
  entities: Iterable<Envelope>,
  personalSpaceOf: (id: EntityId) => number,
  ignoreId?: EntityId,
): Point[] => {
  const cells: Point[] = [];
  for (const entity of entities) {
    if (entity.id === ignoreId) continue;

    const origin = worldPxToCellPx(walk, entity.pos);
    const radius = clampPersonalSpace(personalSpaceOf(entity.id)) - 1;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx * dx + dy * dy > radius * radius) continue;

        const cell = { x: origin.x + dx, y: origin.y + dy };
        if (!inBounds(walk, cell)) continue;

        cells.push(cell);
      }
    }
  }
  return cells;
};
