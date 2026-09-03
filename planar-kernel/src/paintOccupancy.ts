import { cellIndex, inBounds, worldToCell } from './cell.js';
import { MAX_PERSONAL_SPACE } from './types.js';

import type { Actor, Body, EntityId, WalkGrid } from './types.js';

const clampPersonalSpace = (personalSpace: number): number => (
  Math.min(MAX_PERSONAL_SPACE, Math.max(1, personalSpace))
);

export const paintOccupancy = (
  grid: Uint8Array,
  walk: WalkGrid,
  bodies: Iterable<readonly [EntityId, Body]>,
  actors: ReadonlyMap<EntityId, Actor>,
  ignoreId?: EntityId,
): void => {
  for (const [id, body] of bodies) {
    if (id === ignoreId) continue;

    const actor = actors.get(id);
    if (!actor) continue;

    const origin = worldToCell(walk, body.pos);
    const radius = clampPersonalSpace(actor.personalSpace) - 1;
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (dx * dx + dy * dy > radius * radius) continue;

        const cell = { x: origin.x + dx, y: origin.y + dy };
        if (!inBounds(walk, cell)) continue;

        grid[cellIndex(walk, cell)] = 0;
      }
    }
  }
};
