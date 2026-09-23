import { isNothing, just } from '@planar/shared';

import type { ClientModHost, ClientOnAreaLoadCtx, ClientOnAreaUnloadCtx, ClientOnFrameCtx, ClientOnPatchesCtx, ModBag } from '@planar/shared';

const PSTEE_TILE_PX = 64;

type Pixi = {
  Container: { new(): { removeChildren: () => unknown[]; addChild: (c: unknown) => void } };
  Sprite: { new(t: unknown): { x: number; y: number } };
  Texture: { new(opts: unknown): unknown };
  Rectangle: { new(x: number, y: number, w: number, h: number): unknown };
};

type TileState = {
  last: string;
};

const pixiOf = (host: ClientModHost): Pixi => host.pixi as Pixi;
const layerOf = (host: ClientModHost): { removeChildren: () => unknown[]; addChild: (c: unknown) => void } => (
  host.layers.area as { removeChildren: () => unknown[]; addChild: (c: unknown) => void }
);

const overlayTileIndex = (tilemap: { tileIndices: number[] }): number => (
  just(tilemap.tileIndices[0])
);

export const onAreaUnload = (host: ClientModHost, _: ClientOnAreaUnloadCtx): void => {
  const layer = layerOf(host);
  const removed = layer.removeChildren();
  for (const child of removed) {
    (child as { destroy?: () => void }).destroy?.();
  }
};

export const onAreaLoad = async (host: ClientModHost, ctx: ClientOnAreaLoadCtx): Promise<void> => {
  const areId = host.meta().areId;
  if (!areId) return;

  host.assets.need({ kind: 'are', id: areId });
  await host.assets.waitAllLoadings();
  const are = host.assets.peek({ kind: 'are', id: areId });
  if (isNothing(are)) return;

  host.assets.need({ kind: 'wed', id: are.header.wed });
  await host.assets.waitAllLoadings();
  const wed = host.assets.peek({ kind: 'wed', id: are.header.wed });
  if (isNothing(wed)) return;

  const overlay = just(wed.overlays[0]);
  host.assets.need({ kind: 'tis', id: overlay.tileset });
  await host.assets.waitAllLoadings();
  const tisArt = host.assets.peek({ kind: 'tis', id: overlay.tileset });
  if (isNothing(tisArt)) return;

  host.setMapSize(overlay.width * PSTEE_TILE_PX, overlay.height * PSTEE_TILE_PX);
  ctx.bag.tileState = { last: '' } satisfies TileState;
};

const rebuild = (host: ClientModHost, ctx: { bag: ModBag }): void => {
  const areId = host.meta().areId;
  const are = host.assets.peek({ kind: 'are', id: areId });
  if (isNothing(are)) return;
  const wed = host.assets.peek({ kind: 'wed', id: are.header.wed });
  if (isNothing(wed)) return;
  const overlay = just(wed.overlays[0]);
  const tisArt = host.assets.peek({ kind: 'tis', id: overlay.tileset });
  if (isNothing(tisArt)) return;

  const bounds = host.visibleBounds();
  const sx = Math.max(Math.floor(bounds.x / PSTEE_TILE_PX), 0);
  const sy = Math.max(Math.floor(bounds.y / PSTEE_TILE_PX), 0);
  const dx = Math.min(overlay.width, Math.ceil((bounds.x + bounds.width) / PSTEE_TILE_PX));
  const dy = Math.min(overlay.height, Math.ceil((bounds.y + bounds.height) / PSTEE_TILE_PX));
  const key = `${are.resourceName}:${sx}:${sy}:${dx}:${dy}`;
  const state = ctx.bag.tileState as TileState | undefined;
  if (state?.last === key) return;
  if (state) state.last = key;

  const pixi = pixiOf(host);
  const layer = layerOf(host);
  const removed = layer.removeChildren();
  for (const child of removed) {
    (child as { destroy?: () => void }).destroy?.();
  }

  for (let y = sy; y < dy; y += 1) {
    for (let x = sx; x < dx; x += 1) {
      const cell = y * overlay.width + x;
      const tilemap = overlay.tilemaps[cell];
      if (tilemap === undefined) continue;
      const tileIndex = overlayTileIndex(tilemap);
      const frameX = (tileIndex % tisArt.tis.columns) * PSTEE_TILE_PX;
      const frameY = Math.floor(tileIndex / tisArt.tis.columns) * PSTEE_TILE_PX;
      const texture = new pixi.Texture({
        source: tisArt.atlas.source,
        frame: new pixi.Rectangle(frameX, frameY, PSTEE_TILE_PX, PSTEE_TILE_PX),
      });
      const sprite = new pixi.Sprite(texture);
      sprite.x = x * PSTEE_TILE_PX;
      sprite.y = y * PSTEE_TILE_PX;
      layer.addChild(sprite);
    }
  }
};

export const onPatches = (host: ClientModHost, ctx: ClientOnPatchesCtx): void => {
  rebuild(host, ctx);
};

export const onFrame = (host: ClientModHost, ctx: ClientOnFrameCtx): void => {
  rebuild(host, ctx);
};
