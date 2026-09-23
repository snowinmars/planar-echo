import { pointInPoly } from '@planar/kernel';
import { PLAYER_ACTOR_ID } from '@planar/shared';

import type { ConsumableHookEffects, GhostAreDoor, HookEffects, ModBag, Point, ServerFloorOverlayCtx, ServerModHost, ServerOnAreaLoadCtx, ServerOnCommandCtx, ServerOnTickCtx, WorldEffect } from '@planar/shared';

const OPERATING_DISTANCE = 120;
const CAN_CLOSE_DOORS = false;

type Pending = Readonly<{
  actorId: number;
  doorId: string;
  approach: Point;
}>;

type DoorsBag = {
  doors: GhostAreDoor[];
  doorOpen: Map<string, boolean>;
  pending: Pending | undefined;
};

const bagOf = (ctx: { bag: ModBag }): DoorsBag => {
  const { bag } = ctx;
  const missing = !bag.doorOpen;
  if (missing) {
    bag.doors = [];
    bag.doorOpen = new Map();
    bag.pending = undefined;
  }
  return bag;
};

const publish = (bag: DoorsBag): WorldEffect => {
  const doorOpen: Record<string, boolean> = {};
  for (const [id, open] of bag.doorOpen) doorOpen[id] = open;
  return { type: 'publish', row: { doorOpen } };
};

const worldDist = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

const closerPoint = (from: Point, a: Point, b: Point): Point => {
  const da = (from.x - a.x) ** 2 + (from.y - a.y) ** 2;
  const db = (from.x - b.x) ** 2 + (from.y - b.y) ** 2;
  return da <= db ? a : b;
};

const doorPoly = (door: GhostAreDoor, open: boolean): Point[] => (
  open ? door.openedGeometry.vertices : door.closedGeometry.vertices
);

const hitDoor = (bag: DoorsBag, point: Point): GhostAreDoor | undefined => {
  for (const door of bag.doors) {
    const open = bag.doorOpen.get(door.doorId) ?? false;
    if (pointInPoly(point, doorPoly(door, open))) return door;
  }
  return undefined;
};

const openDoor = (bag: DoorsBag, doorId: string): WorldEffect => {
  bag.doorOpen.set(doorId, true);
  bag.pending = undefined;
  return publish(bag);
};

export const onAreaLoad = async (host: ServerModHost, ctx: ServerOnAreaLoadCtx): Promise<HookEffects> => {
  const are = await host.serverGhostReader.current.are();
  const bag = bagOf(ctx);
  bag.doors = [...are.doors];
  bag.doorOpen = new Map();
  bag.pending = undefined;
  for (const door of bag.doors) {
    bag.doorOpen.set(door.doorId, door.flags.includes('door open'));
  }
  return { effects: [publish(bag)] };
};

export const floorOverlay = (_: ServerModHost, ctx: ServerFloorOverlayCtx): Point[] => {
  const bag = bagOf(ctx);
  const cells: Point[] = [];
  for (const door of bag.doors) {
    const open = bag.doorOpen.get(door.doorId) ?? false;
    const doorCells = open ? door.openedGeometry.impeded : door.closedGeometry.impeded;
    for (const cell of doorCells) cells.push(cell);
  }
  return cells;
};

export const onCommand = (host: ServerModHost, ctx: ServerOnCommandCtx): ConsumableHookEffects => {
  const paused = host.meta().paused;
  if (paused) return { consumed: false, effects: [] };

  const { command } = ctx;
  const notClick = command.type !== 'pointer/click';
  if (notClick) return { consumed: false, effects: [] };

  const bag = bagOf(ctx);
  const point = { x: command.x, y: command.y };
  const door = hitDoor(bag, point);

  if (!door) {
    bag.pending = undefined;
    return { consumed: false, effects: [] };
  }

  const open = bag.doorOpen.get(door.doorId) ?? false;
  if (open && !CAN_CLOSE_DOORS) return { consumed: false, effects: [] };
  if (command.button !== 'left') return { consumed: false, effects: [] };

  const actor = host.entity(PLAYER_ACTOR_ID);
  if (!actor) return { consumed: true, effects: [] };

  const approach = closerPoint(actor.pos, door.openLocation, door.closeLocation);
  if (worldDist(actor.pos, approach) <= OPERATING_DISTANCE) {
    const effects = !open ? [openDoor(bag, door.doorId)] : [];
    return { consumed: true, effects };
  }

  bag.pending = { actorId: PLAYER_ACTOR_ID, doorId: door.doorId, approach };
  return {
    consumed: true,
    effects: [{
      type: 'enqueueCommand',
      command: {
        type: 'actor/move',
        seatId: 0,
        actorId: PLAYER_ACTOR_ID,
        dest: approach,
      },
    }],
  };
};

export const onTick = (host: ServerModHost, ctx: ServerOnTickCtx): HookEffects => {
  const paused = host.meta().paused;
  if (paused) return { effects: [] };

  const bag = bagOf(ctx);
  const pending = bag.pending;
  if (!pending) return { effects: [] };

  const actor = host.entity(pending.actorId);
  if (!actor) {
    bag.pending = undefined;
    return { effects: [] };
  }

  if (worldDist(actor.pos, pending.approach) > OPERATING_DISTANCE) return { effects: [] };

  const open = bag.doorOpen.get(pending.doorId) ?? false;
  if (!open) return { effects: [openDoor(bag, pending.doorId)] };
  bag.pending = undefined;
  return { effects: [] };
};
