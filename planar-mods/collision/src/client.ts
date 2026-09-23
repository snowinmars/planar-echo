import { DEFAULT_PERSONAL_SPACE, isNothing } from '@planar/shared';

import type { ClientModHost, ClientOnAreaLoadCtx, ClientOnFrameCtx, ClientOnPatchesCtx, Envelope } from '@planar/shared';

type Gfx = {
  circle: (x: number, y: number, r: number) => Gfx;
  fill: (opts: { color: number; alpha: number }) => void;
};

const radiusOf = (host: ClientModHost, entity: Envelope): number => {
  const animation = host.assets.peek({ kind: 'animation', id: entity.animationId });
  const cells = isNothing(animation)
    ? DEFAULT_PERSONAL_SPACE
    : animation.general.personalSpace || DEFAULT_PERSONAL_SPACE;
  return Math.max(cells, 1) * 16;
};

const needEntityAnimation = (host: ClientModHost, entity: Envelope): void => {
  host.assets.need({ kind: 'animation', id: entity.animationId });
};

export const onAreaLoad = (host: ClientModHost, _: ClientOnAreaLoadCtx): Promise<void> => {
  for (const entity of host.entities()) {
    needEntityAnimation(host, entity);
  }
  return Promise.resolve();
};

export const onPatches = (host: ClientModHost, ctx: ClientOnPatchesCtx): void => {
  for (const patch of ctx.patches) {
    const notUpsert = patch.type !== 'entity/upsert';
    if (notUpsert) continue;
    needEntityAnimation(host, patch.row);
  }
};

export const onFrame = (host: ClientModHost, _: ClientOnFrameCtx): void => {
  const gfx = host.layers.overlay as Gfx;
  for (const entity of host.entities()) {
    gfx.circle(entity.pos.x, entity.pos.y, radiusOf(host, entity));
    gfx.fill({ color: 0x33aaff, alpha: 0.25 });
  }
};
