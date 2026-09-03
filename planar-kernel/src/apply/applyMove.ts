import { nothing, orientFromDelta, type Maybe } from '@planar/shared';
import { astar, closestReachable, reachableFrom } from '../astar.js';
import { cellCenter, cellKey, worldToCell } from '../cell.js';
import { cloneBody } from '../cloneWorld.js';
import { walkGridForPath } from '../rebuildWalk.js';

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

  const walk = walkGridForPath(world, actorId);
  const start = worldToCell(walk, body.pos);
  const destCell = worldToCell(walk, dest);
  const reachable = reachableFrom(walk, start); // TODO [snow]: move after astar calculation as a fallback?
  const destKey = cellKey(destCell);
  const goal = reachable.has(destKey)
    ? destCell
    : closestReachable(reachable, destCell);

  if (!goal) return { events: [{ op: 'command/rejected', reason: 'no-path' }] };

  if (cellKey(goal) === cellKey(start)) {
    const next: Body = {
      pos: { x: body.pos.x, y: body.pos.y },
      speedPxPerTick: body.speedPxPerTick,
      facing: body.facing,
      ...(pendingDoorId ? { pendingDoorId } : {}),
      dest: nothing(),
      path: [],
      pendingDoorId: nothing(),
    };
    world.bodies.set(actorId, next);

    return { events: [{ table: 'bodies', id: actorId, op: 'upsert', row: cloneBody(next) }] };
  }

  const fullPath = astar(walk, start, goal);
  if (fullPath.length === 0) return { events: [{ op: 'command/rejected', reason: 'no-path' }] };

  const path = fullPath.slice(1);
  const first = path[0];
  const facing = first
    ? orientFromDelta(body.pos, cellCenter(walk, first))
    : body.facing;
  const next: Body = {
    pos: { x: body.pos.x, y: body.pos.y },
    speedPxPerTick: body.speedPxPerTick,
    facing,
    dest: { x: dest.x, y: dest.y },
    ...(path.length > 0 ? { path } : { path: [] }),
    ...(pendingDoorId ? { pendingDoorId } : {}),
  };
  world.bodies.set(actorId, next);

  return { events: [{ table: 'bodies', id: actorId, op: 'upsert', row: cloneBody(next) }] };
};

export const applyMove = (world: World, command: Extract<InputCommand, { type: 'actor/move' }>): ApplyResult => setActorDest(world, command.actorId, command.dest);
