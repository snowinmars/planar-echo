import { isNothing } from '@planar/shared';

import type { ClientModHost, ClientOnAreaLoadCtx, ClientOnFrameCtx, ClientOnPatchesCtx, ModBag } from '@planar/shared';

type Gfx = {
  poly: (pts: { x: number; y: number }[]) => Gfx;
  fill: (opts: { color: number; alpha: number }) => void;
};

type DoorsClientBag = {
  doorOpen: Record<string, boolean>;
};

const bagOf = (ctx: { bag: ModBag }): DoorsClientBag => {
  const missing = !ctx.bag.doorOpen;
  if (missing) {
    ctx.bag.doorOpen = {};
  }
  return ctx.bag as unknown as DoorsClientBag;
};

export const onAreaLoad = (host: ClientModHost, _: ClientOnAreaLoadCtx): Promise<void> => {
  const areId = host.meta().areId;
  if (!areId) return Promise.resolve();
  host.assets.need({ kind: 'are', id: areId });
  return Promise.resolve();
};

export const onPatches = (host: ClientModHost, ctx: ClientOnPatchesCtx): void => {
  const bag = bagOf(ctx);
  for (const patch of ctx.patches) {
    const notPublish = patch.type !== 'mod/upsert';
    if (notPublish) continue;

    const notDoors = patch.modId !== 'doors';
    if (notDoors) continue;

    const row = patch.row as { doorOpen?: Record<string, boolean> };
    if (row.doorOpen) bag.doorOpen = row.doorOpen;
  }
};

export const onFrame = (host: ClientModHost, ctx: ClientOnFrameCtx): void => {
  const are = host.assets.peek({ kind: 'are', id: host.meta().areId });
  if (isNothing(are)) return;

  const bag = bagOf(ctx);
  const gfx = host.layers.overlay as Gfx;
  for (const door of are.doors) {
    const open = bag.doorOpen[door.doorId] ?? false;
    const verts = open ? door.openedGeometry.vertices : door.closedGeometry.vertices;
    const tooSmall = verts.length < 3;
    if (tooSmall) continue;

    gfx.poly(verts.map(v => ({ x: v.x, y: v.y })));
    gfx.fill({ color: 0xffaa00, alpha: 0.3 });
  }
};
