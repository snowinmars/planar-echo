import { pointInPoly } from './hitTest.js';

import type { GhostAre } from '@planar/shared';

import type { AreaTravel, EntityId, Point, TravelRegion, World } from './types.js';

export const toTravelRegions = (are: GhostAre): TravelRegion[] => (
  are.regions
    .filter(region => region.type === 'travel region' && region.destinationArea.length > 0)
    .map(region => ({
      name: region.name,
      vertices: region.vertices.map(vertex => ({ x: vertex.x, y: vertex.y })),
      destinationArea: region.destinationArea,
      entranceName: region.entranceName,
    }))
);

export const isTravelRegionActive = (world: World, regionName: string): boolean => {
  const key = regionName;
  for (const door of world.doors.values()) {
    const trigger = door.travelTriggerName;

    if (!trigger) continue;
    if (trigger !== key) continue;

    const open = world.doorOpen.get(door.doorId) ?? false;
    if (!open) return false;
  }

  return true;
};

export const seedTravelInside = (world: World, actorId: EntityId, pos: Point): void => {
  const inside = new Set<string>();

  for (const region of world.travelRegions) {
    if (!isTravelRegionActive(world, region.name)) continue;
    if (pointInPoly(pos, region.vertices)) inside.add(region.name);
  }

  world.travelInside.set(actorId, inside);
};

export const resolveTravelAfterMove = (world: World, actorId: EntityId, pos: Point): AreaTravel | undefined => {
  const prev = world.travelInside.get(actorId) ?? new Set<string>();
  const next = new Set<string>();
  let travel: AreaTravel | undefined;

  for (const region of world.travelRegions) {
    if (!isTravelRegionActive(world, region.name)) continue;
    if (!pointInPoly(pos, region.vertices)) continue;

    const key = region.name;
    next.add(key);

    if (!prev.has(key) && travel === undefined) {
      travel = {
        are: region.destinationArea,
        entrance: region.entranceName,
      };
    }
  }

  world.travelInside.set(actorId, next);
  return travel;
};
