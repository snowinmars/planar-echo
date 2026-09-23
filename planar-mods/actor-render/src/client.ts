import { needActorArt, paintEntity } from './paintEntity.js';
import { bagOf, layerOf } from './shared.js';

import type { ClientModHost, ClientOnAreaLoadCtx, ClientOnAreaUnloadCtx, ClientOnFrameCtx, ClientOnPatchesCtx } from '@planar/shared';

export const onAreaUnload = (host: ClientModHost, ctx: ClientOnAreaUnloadCtx): void => {
  const bag = bagOf(ctx);
  const layer = layerOf(host);

  for (const sprite of bag.sprites.values()) {
    layer.removeChild(sprite);
    sprite.destroy();
  }
  bag.sprites.clear();

  for (const byFrame of bag.textures.values()) {
    for (const texture of byFrame.values()) {
      (texture as { destroy?: () => void }).destroy?.();
    }
  }
  bag.textures.clear();
};

export const onAreaLoad = (host: ClientModHost, _: ClientOnAreaLoadCtx): Promise<void> => {
  for (const entity of host.entities()) {
    needActorArt(host, entity);
  }
  return Promise.resolve();
};

export const onPatches = (host: ClientModHost, ctx: ClientOnPatchesCtx): void => {
  for (const patch of ctx.patches) {
    const notUpsert = patch.type !== 'entity/upsert';
    if (notUpsert) continue;
    needActorArt(host, patch.row);
  }
};

export const onFrame = (host: ClientModHost, ctx: ClientOnFrameCtx): void => {
  const bag = bagOf(ctx);
  const live = new Set<number>();

  for (const entity of host.entities()) {
    live.add(entity.id);
    paintEntity(host, ctx, entity);
  }

  const layer = layerOf(host);
  for (const [id, sprite] of bag.sprites) {
    const stillLive = live.has(id);
    if (stillLive) continue;

    layer.removeChild(sprite);
    sprite.destroy();
    bag.sprites.delete(id);
  }
};
