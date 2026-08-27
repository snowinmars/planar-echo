import { Application, Assets, Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { foldPatches, PASSABLE_WALK, paintDoorFlags } from '@planar/kernel';
import { assetUrl } from '@/shared/assetUrl';
import { isNothing, just, nothing } from '@planar/shared';
import { loadPlayMapGhost } from './loadPlayMapGhost.js';
import { PSTEE_TILE_PX } from './playTiles.js';

import type { DoorView, FromDaemon, Snapshot, WalkGrid, Point } from '@planar/kernel';
import type { GhostAre, GhostTis, GhostWed, Maybe } from '@planar/shared';
import type { PlayView } from './types.js';
import { doorOpenByCell } from './doorOpenByCell.js';
import { overlayTileIndex } from './overlayTileIndex.js';

type MapArt = Readonly<{
  areId: string;
  are: GhostAre;
  wed: GhostWed;
  tis: GhostTis;
  atlas: Texture;
  walkBase: Uint8Array;
}>;

const mapSize = (wed: GhostWed): { w: number; h: number } => {
  const overlay = just(wed.overlays[0]);
  return { w: overlay.width * PSTEE_TILE_PX, h: overlay.height * PSTEE_TILE_PX };
};

const getAtlasFrame = (tileIndex: number, columns: number, tilePx: number): { x: number; y: number } => ({
  x: (tileIndex % columns) * tilePx,
  y: Math.floor(tileIndex / columns) * tilePx,
});

const clamp = (value: number, min: number, max: number): number => (
  Math.min(max, Math.max(min, value))
);

const paintedGrid = (are: GhostAre, walkBase: Uint8Array, doors: DoorView[]): WalkGrid => {
  const walk = are.walk;
  const open = new Map(doors.map(door => [door.id, door.open]));
  const grid = paintDoorFlags(walkBase, walk, are.doors, open);
  return {
    cellWidth: walk.cellWidth,
    cellHeight: walk.cellHeight,
    colsCount: walk.colsCount,
    rowsCount: walk.rowsCount,
    grid,
  };
};

const drawUnpassableTiles = (
  layer: Graphics,
  walk: WalkGrid,
  viewX: number,
  viewY: number,
  viewW: number,
  viewH: number,
): void => {
  layer.clear();

  const sx = Math.max(Math.floor(viewX / walk.cellWidth), 0);
  const sy = Math.max(Math.floor(viewY / walk.cellHeight), 0);
  const dx = Math.min(walk.colsCount, Math.ceil((viewX + viewW) / walk.cellWidth));
  const dy = Math.min(walk.rowsCount, Math.ceil((viewY + viewH) / walk.cellHeight));
  for (let cy = sy; cy < dy; cy += 1) {
    for (let cx = sx; cx < dx; cx += 1) {
      const flag = walk.grid[cy * walk.colsCount + cx] ?? 0;
      const passable = (flag & PASSABLE_WALK) === PASSABLE_WALK;
      if (passable) continue;
      layer.rect(cx * walk.cellWidth, cy * walk.cellHeight, walk.cellWidth, walk.cellHeight);
      layer.fill({ color: 0xff3355, alpha: 0.28 });
    }
  }
};

const drawBodies = (layer: Graphics, snapshot: Snapshot, walk: WalkGrid): void => {
  layer.clear();
  const sorted = [...snapshot.bodies].sort((a, b) => a[1].pos.y - b[1].pos.y);
  const w = Math.max(8, Math.floor(walk.cellWidth / 2));
  const h = Math.max(10, Math.floor(walk.cellHeight / 2));
  for (const [, body] of sorted) {
    layer.rect(body.pos.x - w / 2, body.pos.y - h / 2, w, h);
    layer.fill({ color: 0xd4c27a });
  }
};

// mutable
type LastRenderedTilesState = {
  areId: Maybe<string>;
  sx: Maybe<number>;
  sy: Maybe<number>;
  dx: Maybe<number>;
  dy: Maybe<number>;
  doorGen: number;
};

export type AttachPlayViewProps = Readonly<{
  renderHost: HTMLDivElement;
  serverUrl: string;
  ghostDir: string;
  onClick: (dest: Point) => void;
  onHudUpdate: (tick: number, paused: boolean, areId: string) => void;
}>;
export const attachPlayView = async ({
  renderHost,
  serverUrl,
  ghostDir,
  onClick,
  onHudUpdate,
}: AttachPlayViewProps): Promise<PlayView> => {
  const app = new Application();
  await app.init({
    background: 0x141414,
    resizeTo: renderHost,
    antialias: false,
  });
  renderHost.appendChild(app.canvas);

  const world = new Container();
  const tiles = new Container();
  const debug = new Graphics();
  const actors = new Graphics();
  world.addChild(tiles);
  world.addChild(debug);
  world.addChild(actors);
  app.stage.addChild(world);

  let snapshot: Maybe<Snapshot> = nothing();
  let mapArt: Maybe<MapArt> = nothing();
  let walkGrid: Maybe<WalkGrid> = nothing();
  let loadGen = 0;
  let doorGen = 0;
  let cameraX = 0;
  let cameraY = 0;

  const lastRenderedTilesState: LastRenderedTilesState = {
    areId: nothing(),
    sx: nothing(),
    sy: nothing(),
    dx: nothing(),
    dy: nothing(),
    doorGen: 0,
  };

  const clearTiles = (): void => {
    const removed = tiles.removeChildren();
    for (const child of removed) {
      child.destroy();
    }
  };

  const rebuildTiles = (): void => {
    if (isNothing(snapshot) || isNothing(mapArt)) return;

    const overlay = just(mapArt.wed.overlays[0]);

    /** rectangle of visible tis: [sx,dx)×[sy,dy)
     * sx = first visible tile column
     * sy = first visible tile row
     * dx = exclusive end column
     * dy = exclusive end row
     */
    const sx = Math.max(Math.floor(cameraX / PSTEE_TILE_PX), 0);
    const sy = Math.max(Math.floor(cameraY / PSTEE_TILE_PX), 0);
    const dx = Math.min(overlay.width, Math.ceil((cameraX + app.screen.width + PSTEE_TILE_PX - 1) / PSTEE_TILE_PX));
    const dy = Math.min(overlay.height, Math.ceil((cameraY + app.screen.height + PSTEE_TILE_PX - 1) / PSTEE_TILE_PX));

    const tilesUnchanged = mapArt.areId === lastRenderedTilesState.areId
      && sx === lastRenderedTilesState.sx
      && sy === lastRenderedTilesState.sy
      && dx === lastRenderedTilesState.dx
      && dy === lastRenderedTilesState.dy
      && doorGen === lastRenderedTilesState.doorGen;
    if (tilesUnchanged) return;

    lastRenderedTilesState.areId = mapArt.areId;
    lastRenderedTilesState.sx = sx;
    lastRenderedTilesState.sy = sy;
    lastRenderedTilesState.dx = dx;
    lastRenderedTilesState.dy = dy;
    lastRenderedTilesState.doorGen = doorGen;

    clearTiles();

    const doorOpenByCellMap = doorOpenByCell(overlay.width, overlay.height, mapArt.wed.doors, snapshot.doors);
    for (let y = sy; y < dy; y += 1) {
      for (let x = sx; x < dx; x += 1) {
        const cell = y * overlay.width + x;
        const tilemap = overlay.tilemaps[cell];
        if (tilemap === undefined) continue; // TODO [snow]: seems valid continue, but...

        const tileIndex = overlayTileIndex(tilemap, doorOpenByCellMap.get(cell));
        const frame = getAtlasFrame(tileIndex, mapArt.tis.columns, PSTEE_TILE_PX);
        const texture = new Texture({
          source: mapArt.atlas.source,
          frame: new Rectangle(frame.x, frame.y, PSTEE_TILE_PX, PSTEE_TILE_PX),
        });
        const sprite = new Sprite(texture);
        sprite.x = x * PSTEE_TILE_PX;
        sprite.y = y * PSTEE_TILE_PX;
        tiles.addChild(sprite);
      }
    }
  };

  const layoutCamera = (): void => {
    if (isNothing(snapshot) || isNothing(mapArt)) return;

    const size = mapSize(mapArt.wed);
    // TODO [snow]: camera should follow player, not first entry
    // introduce seatId to createWorld -> bodies and search by it here
    const first = just(snapshot.bodies[0]);
    const actor = just(first[1]);
    const focusX = actor.pos.x;
    const focusY = actor.pos.y;
    const maxX = Math.max(0, size.w - app.screen.width);
    const maxY = Math.max(0, size.h - app.screen.height);
    cameraX = clamp(focusX - app.screen.width / 2, 0, maxX);
    cameraY = clamp(focusY - app.screen.height / 2, 0, maxY);
    world.position.set(-cameraX, -cameraY); // TODO [snow]: to pixi-viewport
    world.hitArea = new Rectangle(0, 0, size.w, size.h);
  };

  const paint = (): void => {
    if (isNothing(snapshot)) return;

    if (!isNothing(mapArt)) {
      walkGrid = paintedGrid(mapArt.are, mapArt.walkBase, snapshot.doors);
    }

    layoutCamera();
    rebuildTiles();

    if (!isNothing(walkGrid)) {
      drawUnpassableTiles(debug, walkGrid, cameraX, cameraY, app.screen.width, app.screen.height);
      drawBodies(actors, snapshot, walkGrid);
    }

    onHudUpdate(snapshot.tick, snapshot.paused, snapshot.areId);
  };

  const loadArt = (areId: string): void => {
    loadGen += 1;
    const gen = loadGen;

    mapArt = nothing();
    walkGrid = nothing();

    clearTiles();

    loadPlayMapGhost(areId, serverUrl, ghostDir)
      .then(async (ghost) => {
        const url = assetUrl(serverUrl, 'tis', ghost.tis.imageName);
        const atlas = await Assets.load(url);
        const stale = gen !== loadGen;
        if (stale) return;
        mapArt = {
          areId,
          are: ghost.are,
          wed: ghost.wed,
          tis: ghost.tis,
          atlas,
          walkBase: ghost.walkBase,
        };
        paint();
      }).catch((err: unknown) => {
        console.error(err);
      });
  };

  world.eventMode = 'static';
  world.on('pointerdown', (event) => {
    const local = world.toLocal(event.global);
    onClick({ x: Math.floor(local.x), y: Math.floor(local.y) });
  });

  app.renderer.on('resize', () => {
    paint();
  });

  const handleFromDaemon = (fromDaemon: FromDaemon): Maybe<Snapshot> => {
    if (fromDaemon.type === 'error') return snapshot;

    if (fromDaemon.type === 'snapshot') {
      const prevAre = isNothing(snapshot) ? nothing() : snapshot.areId;
      snapshot = fromDaemon.snapshot;

      const areaChanged = snapshot.areId !== prevAre;
      if (areaChanged) loadArt(snapshot.areId); // TODO [snow]: that's a race

      paint();

      return snapshot;
    }

    if (fromDaemon.type === 'tick' && !isNothing(snapshot)) {
      snapshot = {
        ...snapshot,
        tick: fromDaemon.tick,
        seq: fromDaemon.seq,
      };
      onHudUpdate(snapshot.tick, snapshot.paused, snapshot.areId);
      return snapshot;
    }

    if (fromDaemon.type === 'patches' && !isNothing(snapshot)) {
      snapshot = { ...foldPatches(snapshot, fromDaemon.patches), seq: fromDaemon.seq, tick: fromDaemon.tick };

      const doorsChanged = fromDaemon.patches.some(patch => patch.op !== 'command/rejected' && patch.table === 'doors');
      if (doorsChanged) doorGen += 1;

      paint();

      return snapshot;
    }
    return snapshot;
  };

  return {
    handleFromDaemon,
    destroy: () => {
      loadGen += 1;
      clearTiles();
      app.destroy(true, { children: true, texture: true });
    },
  };
};
