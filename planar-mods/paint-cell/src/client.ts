import { isNothing, PASSABLE_WALK } from '@planar/shared';

import type { ClientModHost, ClientOnAreaLoadCtx, ClientOnFrameCtx } from '@planar/shared';

type Gfx = {
  rect: (x: number, y: number, w: number, h: number) => Gfx;
  fill: (opts: { color: number; alpha: number }) => void;
};

export const onAreaLoad = async (host: ClientModHost, _: ClientOnAreaLoadCtx): Promise<void> => {
  const areId = host.meta().areId;
  if (!areId) return;
  host.assets.need({ kind: 'are', id: areId });
  await host.assets.waitAllLoadings();
  const are = host.assets.peek({ kind: 'are', id: areId });
  if (isNothing(are)) return;
  host.assets.need({ kind: 'walk', fileName: are.walk.walkBinName });
};

export const onFrame = (host: ClientModHost, _: ClientOnFrameCtx): void => {
  const are = host.assets.peek({ kind: 'are', id: host.meta().areId });
  if (isNothing(are)) return;
  const grid = host.assets.peek({ kind: 'walk', fileName: are.walk.walkBinName });
  if (isNothing(grid)) return;
  const walk = are.walk;
  const gfx = host.layers.overlay as Gfx;
  const bounds = host.visibleBounds();
  const sx = Math.max(Math.floor(bounds.x / walk.cellWidth), 0);
  const sy = Math.max(Math.floor(bounds.y / walk.cellHeight), 0);
  const dx = Math.min(walk.colsCount, Math.ceil((bounds.x + bounds.width) / walk.cellWidth));
  const dy = Math.min(walk.rowsCount, Math.ceil((bounds.y + bounds.height) / walk.cellHeight));
  for (let cy = sy; cy < dy; cy += 1) {
    for (let cx = sx; cx < dx; cx += 1) {
      const flag = grid[cy * walk.colsCount + cx] ?? 0;
      if ((flag & PASSABLE_WALK) === PASSABLE_WALK) continue;
      gfx.rect(cx * walk.cellWidth, cy * walk.cellHeight, walk.cellWidth, walk.cellHeight);
      gfx.fill({ color: 0xff3355, alpha: 0.28 });
    }
  }
};
