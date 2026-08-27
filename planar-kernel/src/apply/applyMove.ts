import { nothing, type Maybe } from '@planar/shared';
import { astar, closestReachable, reachableFrom } from '../astar.js';
import { cellKey, worldToCell } from '../cell.js';
import { cloneBody } from '../cloneWorld.js';

import type {
  ApplyResult,
  EntityId,
  InputCommand,
  World,
  Point,
  Body,
} from '../types.js';

export const setActorDest = (
  world: World,
  actorId: EntityId,
  dest: Point,
  pendingDoorId?: Maybe<string>,
): ApplyResult => {
  if (!world.actors.has(actorId)) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const body = world.bodies.get(actorId);
  if (!body) return { events: [{ op: 'command/rejected', reason: 'unknown-actor' }] };

  const start = worldToCell(world.walkGrid, body.pos);
  const destCell = worldToCell(world.walkGrid, dest);
  const reachable = reachableFrom(world.walkGrid, start); // TODO [snow]: move after astar calculation as a fallback?
  const destKey = cellKey(destCell);
  const goal = reachable.has(destKey)
    ? destCell
    : closestReachable(reachable, destCell);

  if (!goal) return { events: [{ op: 'command/rejected', reason: 'no-path' }] };

  if (cellKey(goal) === cellKey(start)) {
    const next: Body = {
      pos: { x: body.pos.x, y: body.pos.y },
      speedPxPerTick: body.speedPxPerTick,
      ...(pendingDoorId ? { pendingDoorId } : {}),
      dest: nothing(),
      path: [],
      pendingDoorId: nothing(),
    };
    world.bodies.set(actorId, next);

    return { events: [{ table: 'bodies', id: actorId, op: 'upsert', row: cloneBody(next) }] };
  }

  const fullPath = astar(world.walkGrid, start, goal);
  if (fullPath.length === 0) return { events: [{ op: 'command/rejected', reason: 'no-path' }] };

  const path = fullPath.slice(1);
  const next: Body = {
    pos: { x: body.pos.x, y: body.pos.y },
    speedPxPerTick: body.speedPxPerTick,
    dest: { x: dest.x, y: dest.y },
    ...(path.length > 0 ? { path } : { path: [] }),
    ...(pendingDoorId ? { pendingDoorId } : {}),
  };
  world.bodies.set(actorId, next);

  return { events: [{ table: 'bodies', id: actorId, op: 'upsert', row: cloneBody(next) }] };
};

export const applyMove = (world: World, command: Extract<InputCommand, { type: 'actor/move' }>): ApplyResult => setActorDest(world, command.actorId, command.dest);
