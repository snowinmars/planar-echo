import { cloneActor, cloneBody } from './cloneWorld.js';

import type { Actor, Body, DoorView, Patch, Snapshot } from './types.js';

const upsertBody = (snapshot: Snapshot, id: number, row: Body): Snapshot => ({
  ...snapshot,
  bodies: [...snapshot.bodies.filter(([bodyId]) => bodyId !== id), [id, cloneBody(row)]],
});

const upsertActor = (snapshot: Snapshot, id: number, row: Actor): Snapshot => ({
  ...snapshot,
  actors: [...snapshot.actors.filter(([actorId]) => actorId !== id), [id, cloneActor(row)]],
});

const upsertDoor = (snapshot: Snapshot, id: string, row: DoorView): Snapshot => ({
  ...snapshot,
  doors: [...snapshot.doors.filter(door => door.id !== id), row],
});

export const foldPatches = (snapshot: Snapshot, patches: readonly Patch[]): Snapshot => {
  let next = snapshot;
  for (const patch of patches) {
    if (patch.op === 'command/rejected') continue;
    if (patch.table === 'meta') {
      next = {
        ...next,
        tickHz: patch.row.tickHz,
        paused: patch.row.paused,
        nextId: patch.row.nextId,
        areId: patch.row.areId,
        canCloseDoors: patch.row.canCloseDoors,
      };
      continue;
    }
    if (patch.table === 'bodies') {
      next = upsertBody(next, patch.id, patch.row);
      continue;
    }
    if (patch.table === 'doors') {
      next = upsertDoor(next, patch.id, patch.row);
      continue;
    }
    next = upsertActor(next, patch.id, patch.row);
  }
  return next;
};
