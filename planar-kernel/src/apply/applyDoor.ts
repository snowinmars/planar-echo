import { nothing } from '@planar/shared';

import { cloneBody, doorView } from '../cloneWorld.js';
import { rebuildWalk } from '../rebuildWalk.js';

import type { ApplyResult, EntityId, Patch, World } from '../types.js';

export const toggleDoor = (world: World, doorId: string, actorId?: EntityId): ApplyResult => {
  if (!world.doors.has(doorId)) return { events: [{ op: 'command/rejected', reason: 'unknown-door' }] };

  const nextOpen = !(world.doorOpen.get(doorId) ?? false);
  world.doorOpen.set(doorId, nextOpen);

  rebuildWalk(world);

  const events: Patch[] = [
    { table: 'doors', id: doorId, op: 'upsert', row: doorView(doorId, nextOpen) },
  ];

  if (actorId !== undefined) {
    const body = world.bodies.get(actorId);

    if (body) {
      // body should stop after opening door
      const cleared = {
        pos: { x: body.pos.x, y: body.pos.y },
        speedPxPerTick: body.speedPxPerTick,
        facing: body.facing,
        dest: nothing(),
        path: [],
        pendingDoorId: nothing(),
      };

      world.bodies.set(actorId, cleared);
      events.push({ table: 'bodies', id: actorId, op: 'upsert', row: cloneBody(cleared) });
    }
  }

  return { events };
};
