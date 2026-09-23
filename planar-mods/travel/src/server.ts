import { pointInPoly } from '@planar/kernel';
import { PLAYER_ACTOR_ID } from '@planar/shared';

import type { HookEffects, ModBag, Point, ServerModHost, ServerOnAreaLoadCtx, ServerOnTickCtx } from '@planar/shared';

type Region = Readonly<{
  name: string;
  vertices: Point[];
  destinationArea: string;
  entranceName: string;
}>;

type TravelBag = {
  regions: Region[];
  inside: Set<string>;
};

const bagOf = (ctx: { bag: ModBag }): TravelBag => {
  const { bag } = ctx;
  const missing = !bag.regions;
  if (missing) {
    bag.regions = [];
    bag.inside = new Set();
  }
  return bag as unknown as TravelBag;
};

export const onAreaLoad = async (host: ServerModHost, ctx: ServerOnAreaLoadCtx): Promise<HookEffects> => {
  const are = await host.serverGhostReader.current.are();
  const bag = bagOf(ctx);
  bag.regions = are.regions
    .filter(region => region.type === 'travel region' && region.destinationArea.length > 0)
    .map(region => ({
      name: region.name,
      vertices: region.vertices.map(vertex => ({ x: vertex.x, y: vertex.y })),
      destinationArea: region.destinationArea,
      entranceName: region.entranceName,
    }));

  const player = host.entity(PLAYER_ACTOR_ID);
  bag.inside = new Set();
  if (!player) return { effects: [] };
  for (const region of bag.regions) {
    if (pointInPoly(player.pos, region.vertices)) bag.inside.add(region.name);
  }
  return { effects: [] };
};

export const onTick = (host: ServerModHost, ctx: ServerOnTickCtx): HookEffects => {
  const paused = host.meta().paused;
  if (paused) return { effects: [] };

  const player = host.entity(PLAYER_ACTOR_ID);
  if (!player) return { effects: [] };
  const bag = bagOf(ctx);
  const prev = bag.inside;
  const next = new Set<string>();
  let travel: { are: string; entrance: string } | undefined;

  for (const region of bag.regions) {
    if (!pointInPoly(player.pos, region.vertices)) continue;
    next.add(region.name);
    if (!prev.has(region.name) && travel === undefined) {
      travel = { are: region.destinationArea, entrance: region.entranceName };
    }
  }

  bag.inside = next;
  if (!travel) return { effects: [] };
  return { effects: [{ type: 'loadArea', are: travel.are, entrance: travel.entrance }] };
};
