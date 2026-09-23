import { createMemoStore, DEFAULT_PERSONAL_SPACE, isNothing, optional } from '@planar/shared';

import { paintOccupancy } from './paintOccupancy.js';

import type { EntityId, Envelope, HookEffects, MemoStore, ModBag, Point, ServerModHost, ServerOnAreaLoadCtx, ServerOccupancyCtx } from '@planar/shared';

type CollisionBag = {
  space: MemoStore<EntityId, number>;
};

const bagOf = (ctx: { bag: ModBag }): CollisionBag => {
  const space = ctx.bag.space;
  const invalid = typeof space !== 'object' || space === null || !('load' in space);
  if (invalid) {
    ctx.bag.space = createMemoStore<EntityId, number>();
  }
  return ctx.bag;
};

const loadSpace = async (host: ServerModHost, entity: Envelope): Promise<number> => {
  try {
    const animation = await host.serverGhostReader.load.animation(entity.animationId);
    if (isNothing(animation)) {
      console.warn(`collision: missing GhostIniAnimation for ${entity.cre}`);
      return DEFAULT_PERSONAL_SPACE;
    }
    return animation.general.personalSpace || DEFAULT_PERSONAL_SPACE;
  }
  catch {
    return DEFAULT_PERSONAL_SPACE;
  }
};

const requestSpace = (host: ServerModHost, ctx: { bag: ModBag }, entity: Envelope): void => {
  bagOf(ctx).space.load(entity.id, () => loadSpace(host, entity));
};

const spaceOf = (host: ServerModHost, ctx: { bag: ModBag }, entity: Envelope): number => (
  optional(bagOf(ctx).space.get(entity.id), DEFAULT_PERSONAL_SPACE)
);

export const onAreaLoad = async (host: ServerModHost, ctx: ServerOnAreaLoadCtx): Promise<HookEffects> => {
  for (const entity of host.entities()) {
    requestSpace(host, ctx, entity);
  }
  await bagOf(ctx).space.waitAllLoadings();
  return { effects: [] };
};

export const occupancy = (
  host: ServerModHost,
  ctx: ServerOccupancyCtx,
): Point[] => {
  for (const entity of host.entities()) {
    requestSpace(host, ctx, entity);
  }
  return paintOccupancy(
    ctx.walk,
    host.entities(),
    (id) => {
      const entity = host.entity(id);
      if (isNothing(entity)) return DEFAULT_PERSONAL_SPACE;
      return spaceOf(host, ctx, entity);
    },
    ctx.ignoreId,
  );
};
