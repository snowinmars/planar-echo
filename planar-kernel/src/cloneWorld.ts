import type { Actor, Body, DoorView, Snapshot, World } from './types.js';

// I do think that these clones are redundant
export const cloneBody = (body: Body): Body => { // to structuredClone
  const next: Body = {
    pos: { x: body.pos.x, y: body.pos.y },
    speedPxPerTick: body.speedPxPerTick,
    facing: body.facing,
    ...(body.dest ? { dest: { x: body.dest.x, y: body.dest.y } } : {}),
    ...(body.path && body.path.length > 0
      ? { path: body.path.map(cell => ({ x: cell.x, y: cell.y })) }
      : { path: [] }),
    ...(body.pendingDoorId ? { pendingDoorId: body.pendingDoorId } : {}),
  };
  return next;
};

export const cloneActor = (actor: Actor): Actor => ({
  exists: true,
  cre: actor.cre,
  personalSpace: actor.personalSpace,
});

export const doorView = (id: string, open: boolean): DoorView => ({ id, open });

export const cloneWorld = (world: World, seq: number): Snapshot => ({
  tick: world.meta.tick,
  seq,
  tickHz: world.meta.tickHz,
  paused: world.meta.paused,
  nextId: world.meta.nextId,
  areId: world.meta.areId,
  canCloseDoors: world.meta.canCloseDoors,
  doors: [...world.doors.keys()].map(id => doorView(id, world.doorOpen.get(id) ?? false)), // TODO [snow]: to map
  bodies: [...world.bodies.entries()].map(([id, body]) => [id, cloneBody(body)] as const), // TODO [snow]: to map with body.id to string
  actors: [...world.actors.entries()].map(([id, actor]) => [id, cloneActor(actor)] as const), // TODO [snow]: to map, after all is done - to structuredClone
});
