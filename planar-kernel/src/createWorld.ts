import { facingFromDirection, isNothing } from '@planar/shared';

import { rebuildWalk } from './rebuildWalk.js';
import { firstPassableCenter } from './spawn.js';
import { seedTravelInside, toTravelRegions } from './travel.js';
import { DEFAULT_SPEED_PX_PER_TICK, PLAYER_ACTOR_ID, TICK_HZ } from './types.js';

import type { GhostAre, GhostAreDoor, Maybe } from '@planar/shared';

import type { Body, NpcSpawn, PlayerSpawn, Point, World } from './types.js';

const makeBody = (pos: Point, facing: number): Body => ({
  pos: { x: pos.x, y: pos.y },
  speedPxPerTick: DEFAULT_SPEED_PX_PER_TICK,
  facing,
  path: [],
});

const pickSpawn = (are: GhostAre, world: Pick<World, 'walkGrid'>, entrance?: Maybe<string>): { pos: Point; facing: number } => {
  if (entrance) {
    const named = are.entrances.find(item => item.name === entrance);
    if (named) return { pos: { x: named.at.x, y: named.at.y }, facing: facingFromDirection(named.direction) };
  }

  const first = are.entrances[0];
  if (first) return { pos: { x: first.at.x, y: first.at.y }, facing: facingFromDirection(first.direction) };

  const cell = firstPassableCenter(world.walkGrid);
  if (!isNothing(cell)) return { pos: cell, facing: 0 };

  throw new Error(`${are.resourceName}: no entrance and no PASSABLE cell`);
};

export const createWorld = (
  are: GhostAre,
  grid: Uint8Array,
  entrance: Maybe<string>,
  player: PlayerSpawn,
  npcs: NpcSpawn[],
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
      canCloseDoors: false,
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
    travelRegions: toTravelRegions(are),
    travelInside: new Map(),
    bodies: new Map(),
    actors: new Map(),
  };

  const spawn = pickSpawn(are, world, entrance);
  world.bodies.set(PLAYER_ACTOR_ID, makeBody(spawn.pos, spawn.facing));
  world.actors.set(PLAYER_ACTOR_ID, {
    exists: true,
    cre: player.cre,
    personalSpace: player.personalSpace,
  });

  let nextId = 2;
  for (const npc of npcs) {
    world.bodies.set(nextId, makeBody(npc.pos, npc.facing));
    world.actors.set(nextId, {
      exists: true,
      cre: npc.cre,
      personalSpace: npc.personalSpace,
    });
    nextId += 1;
  }

  world.meta = {
    ...world.meta,
    nextId,
  };

  rebuildWalk(world);
  seedTravelInside(world, PLAYER_ACTOR_ID, spawn.pos);

  return world;
};
