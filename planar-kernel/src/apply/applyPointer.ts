import { setActorDest } from './applyMove.js';
import { toggleDoor } from './applyDoor.js';
import { closerPoint, hitDoor, worldDist } from '../hitTest.js';
import { PST_OPERATING_DISTANCE } from '../types.js';
import { isNothing, nothing } from '@planar/shared';

import type { ApplyResult, InputCommand, World } from '../types.js';
import type { Maybe } from '@planar/shared';

export const firstActorId = (world: World): Maybe<number> => {
  const first = world.actors.keys().next();

  return first.done ? nothing() : first.value;
};

export const applyPointer = (
  world: World,
  command: Extract<InputCommand, { type: 'pointer/click' }>,
): ApplyResult => {
  const actorId = firstActorId(world);
  if (isNothing(actorId)) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const body = world.bodies.get(actorId);
  if (isNothing(body)) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const point = { x: command.x, y: command.y };
  const door = hitDoor(world.doors.values(), world.doorOpen, point);
  if (isNothing(door)) return setActorDest(world, actorId, point);

  const approach = closerPoint(body.pos, door.openLocation, door.closeLocation);
  const rightClick = command.button === 'right';
  if (rightClick) return setActorDest(world, actorId, approach);

  const closeEnough = worldDist(body.pos, approach) <= PST_OPERATING_DISTANCE;
  if (closeEnough) return toggleDoor(world, door.doorId.trim(), actorId);

  return setActorDest(world, actorId, approach, door.doorId.trim());
};
