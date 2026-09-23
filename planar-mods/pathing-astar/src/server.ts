import {
  cellKey,
  cellPxToWorldPx,
  worldPxToCellPx,
} from '@planar/kernel';
import {
  createMemoStore,
  DEFAULT_SPEED_PX_PER_TICK,
  isNothing,
  optional,
  orientFromDelta,
  PLAYER_ACTOR_ID,
} from '@planar/shared';

import { astar } from './astar.js';
import { closestReachable } from './closestReachable.js';
import { reachableFrom } from './reachableFrom.js';

import type { ConsumableHookEffects, Envelope, HookEffects, MemoStore, ModBag, Point, ServerModHost, ServerOnAreaLoadCtx, ServerOnCommandCtx, ServerOnTickCtx, WorldEffect } from '@planar/shared';

type PathingBag = {
  paths: Map<number, Point[]>;
  dests: Map<number, Point>;
  speed: MemoStore<number, number>;
};

const bagOf = (ctx: { bag: ModBag }): PathingBag => {
  const { bag } = ctx;
  const missing = !bag.paths;
  if (missing) {
    bag.paths = new Map();
    bag.dests = new Map();
    bag.speed = createMemoStore<number, number>();
  }
  return bag as unknown as PathingBag;
};

const stepToward = (from: number, to: number, budget: number): { next: number; used: number } => {
  const delta = to - from;
  const abs = Math.abs(delta);
  if (abs === 0) return { next: from, used: 0 };
  if (abs <= budget) return { next: to, used: abs };
  return { next: from + Math.sign(delta) * budget, used: budget };
};

const loadSpeed = async (host: ServerModHost, entity: Envelope): Promise<number> => {
  try {
    const animation = await host.serverGhostReader.load.animation(entity.animationId);
    if (isNothing(animation)) {
      console.warn(`pathing: missing GhostIniAnimation for ${entity.cre}`);
      return DEFAULT_SPEED_PX_PER_TICK;
    }
    return animation.general.moveScale > 0 ? animation.general.moveScale : DEFAULT_SPEED_PX_PER_TICK;
  }
  catch {
    return DEFAULT_SPEED_PX_PER_TICK;
  }
};

const requestSpeed = (host: ServerModHost, ctx: { bag: ModBag }, entity: Envelope): void => {
  bagOf(ctx).speed.load(entity.id, () => loadSpeed(host, entity));
};

const speedOf = (host: ServerModHost, ctx: { bag: ModBag }, entity: Envelope): number => (
  optional(bagOf(ctx).speed.get(entity.id), DEFAULT_SPEED_PX_PER_TICK)
);

export const onAreaLoad = async (host: ServerModHost, ctx: ServerOnAreaLoadCtx): Promise<HookEffects> => {
  for (const entity of host.entities()) {
    requestSpeed(host, ctx, entity);
  }
  await bagOf(ctx).speed.waitAllLoadings();
  return { effects: [] };
};

const planPath = (host: ServerModHost, ctx: { bag: ModBag }, actorId: number, dest: Point): WorldEffect[] => {
  const entity = host.entity(actorId);
  if (isNothing(entity)) return [];

  const walk = host.searchWalk(actorId);
  const start = worldPxToCellPx(walk, entity.pos);
  const destCell = worldPxToCellPx(walk, dest);
  const reachable = reachableFrom(walk, start);
  const destKey = cellKey(destCell);
  const goal = reachable.has(destKey) ? destCell : closestReachable(reachable, destCell);
  const bag = bagOf(ctx);

  const noGoal = !goal;
  if (noGoal) {
    bag.paths.set(actorId, []);
    bag.dests.delete(actorId);
    return [];
  }

  const alreadyThere = cellKey(goal) === cellKey(start);
  if (alreadyThere) {
    bag.paths.set(actorId, []);
    bag.dests.delete(actorId);
    return [{ type: 'entityPatch', id: actorId, patch: { sequence: 'stand' } }];
  }

  const fullPath = astar(walk, start, goal);
  const emptyPath = fullPath.length === 0;
  if (emptyPath) {
    bag.paths.set(actorId, []);
    bag.dests.delete(actorId);
    return [];
  }

  const path = fullPath.slice(1);
  const first = path[0];
  const facing = first ? orientFromDelta(entity.pos, cellPxToWorldPx(walk, first)) : entity.facing;
  bag.paths.set(actorId, path);
  return [{ type: 'entityPatch', id: actorId, patch: { facing, sequence: 'walk' } }];
};

export const onCommand = (host: ServerModHost, ctx: ServerOnCommandCtx): ConsumableHookEffects => {
  const paused = host.meta().paused;
  if (paused) return { consumed: false, effects: [] };

  const bag = bagOf(ctx);
  const { command } = ctx;
  if (command.type === 'pointer/click') {
    bag.dests.set(PLAYER_ACTOR_ID, { x: command.x, y: command.y });
    bag.paths.delete(PLAYER_ACTOR_ID);
    return { consumed: true, effects: [] };
  }
  if (command.type === 'actor/move') {
    bag.dests.set(command.actorId, command.dest);
    bag.paths.delete(command.actorId);
    return { consumed: true, effects: [] };
  }
  return { consumed: false, effects: [] };
};

export const onTick = (host: ServerModHost, ctx: ServerOnTickCtx): HookEffects => {
  const paused = host.meta().paused;
  if (paused) return { effects: [] };

  const bag = bagOf(ctx);
  const walk = host.walk();
  const effects: WorldEffect[] = [];

  for (const entity of host.entities()) {
    requestSpeed(host, ctx, entity);
  }

  for (const entity of host.entities()) {
    const dest = bag.dests.get(entity.id);
    const hasPath = bag.paths.has(entity.id);
    if (dest && !hasPath) effects.push(...planPath(host, ctx, entity.id, dest));

    const path = bag.paths.get(entity.id);
    const idle = !path || path.length === 0;
    if (idle) continue;

    const speed = speedOf(host, ctx, entity);
    let x = entity.pos.x;
    let y = entity.pos.y;
    let remaining = speed;
    let facing = entity.facing;
    const nextPath = path.map(cell => ({ x: cell.x, y: cell.y }));

    while (remaining > 0 && nextPath.length > 0) {
      const waypoint = nextPath[0];
      if (!waypoint) break;
      const center = cellPxToWorldPx(walk, waypoint);
      if (x !== center.x || y !== center.y) {
        facing = orientFromDelta({ x, y }, center);
      }
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

    bag.paths.set(entity.id, nextPath);
    const moving = nextPath.length > 0;
    if (!moving) bag.dests.delete(entity.id);
    const sequence = moving
      ? (speed >= DEFAULT_SPEED_PX_PER_TICK ? 'run' : 'walk')
      : 'stand';
    effects.push({
      type: 'entityPatch',
      id: entity.id,
      patch: {
        pos: { x, y },
        facing,
        sequence,
      },
    });
  }

  return { effects };
};
