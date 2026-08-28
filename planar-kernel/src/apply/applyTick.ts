import { cellCenter } from '../cell.js';
import { cloneBody } from '../cloneWorld.js';
import { closerPoint, worldDist } from '../hitTest.js';
import { toggleDoor } from './applyDoor.js';
import { PST_OPERATING_DISTANCE } from '../types.js';
import { resolveTravelAfterMove } from '../travel.js';

import type { ApplyResult, Body, Point, Patch, World } from '../types.js';

const stepToward = (from: number, to: number, budget: number): { next: number; used: number } => {
  const delta = to - from;
  const abs = Math.abs(delta);

  if (abs === 0) return { next: from, used: 0 };

  if (abs <= budget) return { next: to, used: abs };

  return { next: from + Math.sign(delta) * budget, used: budget };
};

const advanceBody = (body: Body, grid: World['walkGrid']): Body => {
  let x = body.pos.x;
  let y = body.pos.y;
  let remaining = body.speedPxPerTick;
  const nextPath: Point[] = body.path.map(cell => ({ x: cell.x, y: cell.y }));

  while (remaining > 0 && nextPath.length > 0) {
    const waypoint = nextPath[0];
    if (!waypoint) break;

    const center = cellCenter(grid, waypoint);
    const stepX = stepToward(x, center.x, remaining);
    x = stepX.next;
    remaining -= stepX.used;

    if (remaining <= 0 && !(x === center.x && y === center.y)) break;

    const stepY = stepToward(y, center.y, remaining);
    y = stepY.next;
    remaining -= stepY.used;

    if (x === center.x && y === center.y) nextPath.shift();
    else break;
  }

  if (nextPath.length === 0) {
    return {
      pos: { x, y },
      speedPxPerTick: body.speedPxPerTick,
      ...(body.pendingDoorId ? { pendingDoorId: body.pendingDoorId } : {}),
      path: [],
    };
  }

  return {
    pos: { x, y },
    speedPxPerTick: body.speedPxPerTick,
    ...(body.dest ? { dest: { x: body.dest.x, y: body.dest.y } } : {}),
    path: nextPath,
    ...(body.pendingDoorId ? { pendingDoorId: body.pendingDoorId } : {}),
  };
};

// TODO [snow]: copypasted logic? search by PST_OPERATING_DISTANCE
const resolvePendingDoor = (world: World, actorId: number, body: Body): readonly Patch[] => {
  const doorId = body.pendingDoorId;
  if (!doorId) return [];

  const door = world.doors.get(doorId);
  if (!door) return [];

  const approach = closerPoint(body.pos, door.openLocation, door.closeLocation);
  const arrived = !body.path || body.path.length === 0;
  if (!arrived && worldDist(body.pos, approach) > PST_OPERATING_DISTANCE) return [];

  return toggleDoor(world, doorId, actorId).events;
};

export const applyTick = (world: World): ApplyResult => {
  if (world.meta.paused) return { events: [] };

  world.meta = {
    ...world.meta,
    tick: world.meta.tick + 1,
  };

  const events: Patch[] = [];

  for (const [id, body] of world.bodies) {
    let next = body;
    const prevPos = body.pos;
    if (body.path && body.path.length > 0) {
      next = advanceBody(body, world.walkGrid);
      world.bodies.set(id, next);
      events.push({ table: 'bodies', id, op: 'upsert', row: cloneBody(next) });
    }

    if (next.pendingDoorId) {
      events.push(...resolvePendingDoor(world, id, next));
    }

    const moved = next.pos.x !== prevPos.x || next.pos.y !== prevPos.y;
    if (!moved) continue;

    const travel = resolveTravelAfterMove(world, id, next.pos);
    if (travel) return { events, travel };
  }

  return { events };
};
