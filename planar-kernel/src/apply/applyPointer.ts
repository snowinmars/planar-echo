import { isNothing } from '@planar/shared';

import { closerPoint, hitDoor, worldDist } from '../hitTest.js';
import { PLAYER_ACTOR_ID, PST_OPERATING_DISTANCE } from '../types.js';
import { toggleDoor } from './applyDoor.js';
import { setActorDest } from './applyMove.js';

import type { ApplyResult, InputCommand, World } from '../types.js';

export const applyPointer = (
  world: World,
  command: Extract<InputCommand, { type: 'pointer/click' }>,
): ApplyResult => {
  const actorId = PLAYER_ACTOR_ID;
  if (!world.actors.has(actorId)) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const body = world.bodies.get(actorId);
  if (isNothing(body)) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const point = { x: command.x, y: command.y };
  const door = hitDoor(world.doors.values(), world.doorOpen, point);
  if (isNothing(door)) return setActorDest(world, actorId, point);

  const doorId = door.doorId;
  const open = world.doorOpen.get(door.doorId) ?? world.doorOpen.get(doorId) ?? false;
  if (open && !world.meta.canCloseDoors) return setActorDest(world, actorId, point);

  const approach = closerPoint(body.pos, door.openLocation, door.closeLocation);
  const rightClick = command.button === 'right';
  if (rightClick) return setActorDest(world, actorId, approach);

  const closeEnough = worldDist(body.pos, approach) <= PST_OPERATING_DISTANCE;
  if (closeEnough) return toggleDoor(world, doorId, actorId);

  return setActorDest(world, actorId, approach, doorId);
};
