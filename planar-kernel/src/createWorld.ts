import { TICK_HZ, DEFAULT_SPEED_PX_PER_TICK } from './types.js';
import { paintAllDoors } from './paintDoors.js';
import { firstPassableCenter } from './spawn.js';

import type { GhostAre, GhostAreDoor, Maybe } from '@planar/shared';
import type { Actor, Body, World, Point } from './types.js';

const pickSpawn = (are: GhostAre, world: Pick<World, 'walkGrid'>, entrance?: Maybe<string>): Point => {
  if (entrance) {
    const named = are.entrances.find(item => item.name === entrance);
    if (named) return { x: named.at.x, y: named.at.y };
  }

  const first = are.entrances[0];
  if (first) return { x: first.at.x, y: first.at.y };

  const cell = firstPassableCenter(world.walkGrid);
  if (cell) return cell;

  throw new Error(`${are.resourceName}: no entrance and no PASSABLE cell`);
};

export const createWorld = (
  are: GhostAre,
  grid: Uint8Array,
  entrance?: Maybe<string>,
): World => {
  const walk = are.walk;

  const doors = new Map<string, GhostAreDoor>();
  const doorOpen = new Map<string, boolean>();
  for (const door of are.doors) {
    const id = door.doorId;
    doors.set(id, door);
    doorOpen.set(id, door.flags.includes('door open'));
  }

  const world: World = {
    meta: {
      tick: 0,
      tickHz: TICK_HZ,
      paused: false,
      nextId: 2,
      areId: are.resourceName,
    },
    walkBase: Uint8Array.from(grid),
    walkGrid: {
      cellWidth: walk.cellWidth,
      cellHeight: walk.cellHeight,
      colsCount: walk.colsCount,
      rowsCount: walk.rowsCount,
      grid: Uint8Array.from(grid),
    },
    doors,
    doorOpen,
    bodies: new Map<number, Body>(),
    actors: new Map<number, Actor>(),
  };

  const pos = pickSpawn(are, world, entrance);
  world.bodies.set(1, {
    pos,
    speedPxPerTick: DEFAULT_SPEED_PX_PER_TICK,
    path: [],
  });

  world.actors.set(1, { exists: true });
  paintAllDoors(world);

  return world;
};
