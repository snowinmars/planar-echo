import {
  Application,
  Assets,
  Container,
  Graphics,
  Rectangle,
  Sprite,
  Texture,
} from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { foldPatches, paintDoorFlags, PASSABLE_WALK, PLAYER_ACTOR_ID } from '@planar/kernel';
import { isNothing, just, nothing } from '@planar/shared';

import { assetUrl } from '@/shared/assetUrl';

import { doorOpenByCell } from './doorOpenByCell.js';
import { createCreArtCache, ensureCreArt } from './loadCreArt.js';
import { loadPlayMapGhost } from './loadPlayMapGhost.js';
import { overlayTileIndex } from './overlayTileIndex.js';
import { PSTEE_TILE_PX } from './playTiles.js';
import { clearCreSprites, syncCreSprites } from './syncCreSprites.js';

import type { Ticker } from 'pixi.js';

import type {
  DoorView,
  FromDaemon,
  Point,
  Snapshot,
  WalkGrid,
} from '@planar/kernel';
import type { GhostAre, GhostTis, GhostWed, Maybe } from '@planar/shared';

import type { PlayView } from './types.js';

type MapArt = Readonly<{
  areId: string;
  are: GhostAre;
  wed: GhostWed;
  tis: GhostTis;
  atlas: Texture;
  walkBase: Uint8Array;
}>;

export type PlayPointerClick = Point & Readonly<{
  button: 'left' | 'right';
}>;

const EDGE_PX = 40;
const PAN_CSS_PX_PER_SEC = 500;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

const mapSize = (wed: GhostWed): { w: number; h: number } => {
  const overlay = just(wed.overlays[0]);
  return { w: overlay.width * PSTEE_TILE_PX, h: overlay.height * PSTEE_TILE_PX };
};

const getAtlasFrame = (tileIndex: number, columns: number, tilePx: number): { x: number; y: number } => ({
  x: (tileIndex % columns) * tilePx,
  y: Math.floor(tileIndex / columns) * tilePx,
});

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

const decodeMouseButton = (button: number): Maybe<PlayPointerClick['button']> => {
  if (button === 0) return 'left';
  if (button === 2) return 'right';
  return nothing();
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
  onClick: (dest: PlayPointerClick) => void;
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

  const viewport = new Viewport({
    events: app.renderer.events,
    noTicker: true,
    screenWidth: app.screen.width,
    screenHeight: app.screen.height,
    worldWidth: app.screen.width,
    worldHeight: app.screen.height,
    passiveWheel: false,
    disableOnContextMenu: true,
  });

  viewport
    .wheel()
    .clamp({ direction: 'all', underflow: 'center' })
    .clampZoom({ minScale: MIN_ZOOM, maxScale: MAX_ZOOM });
  viewport.eventMode = 'static';

  app.stage.addChild(viewport);

  const tiles = new Container();
  tiles.eventMode = 'none';

  const debug = new Graphics();
  debug.eventMode = 'none';

  const actors = new Container();
  actors.eventMode = 'none';
  actors.sortableChildren = true;

  const followMarker = new Container();
  followMarker.eventMode = 'none';

  viewport.addChild(tiles);
  viewport.addChild(debug);
  viewport.addChild(actors);
  viewport.addChild(followMarker);

  let snapshot: Maybe<Snapshot> = nothing();
  let mapArt: Maybe<MapArt> = nothing();
  let walkGrid: Maybe<WalkGrid> = nothing();
  let loadGen = 0;
  let doorGen = 0;
  let following = false;
  let viewAlive = true;
  let snappedAreId: Maybe<string> = nothing();
  let pointerOverCanvas = false;
  const creArt = createCreArtCache();
  const creSprites = new Map<number, Sprite>();
  const pointerScreen = { x: 0, y: 0 };
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

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

  const syncViewportSize = (): void => {
    if (isNothing(mapArt)) {
      viewport.resize(app.screen.width, app.screen.height);
      return;
    }

    const size = mapSize(mapArt.wed);
    viewport.resize(app.screen.width, app.screen.height, size.w, size.h);
  };

  const rebuildTiles = (): void => {
    if (isNothing(snapshot) || isNothing(mapArt)) return;

    const overlay = just(mapArt.wed.overlays[0]);
    const bounds = viewport.getVisibleBounds();

    /** rectangle of visible tis: [sx,dx)×[sy,dy)
     * sx = first visible tile column
     * sy = first visible tile row
     * dx = exclusive end column
     * dy = exclusive end row
     */
    const sx = Math.max(Math.floor(bounds.x / PSTEE_TILE_PX), 0);
    const sy = Math.max(Math.floor(bounds.y / PSTEE_TILE_PX), 0);
    const dx = Math.min(overlay.width, Math.ceil((bounds.x + bounds.width) / PSTEE_TILE_PX));
    const dy = Math.min(overlay.height, Math.ceil((bounds.y + bounds.height) / PSTEE_TILE_PX));

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

  const firstActorPos = (): Maybe<{ x: number; y: number }> => {
    if (isNothing(snapshot)) return nothing();

    const found = snapshot.bodies.find(([id]) => id === PLAYER_ACTOR_ID);
    if (!found) return nothing();

    return found[1].pos;
  };

  const layoutCamera = (): void => {
    if (isNothing(snapshot) || isNothing(mapArt)) return;

    syncViewportSize();

    const pos = firstActorPos();
    if (isNothing(pos)) return;

    followMarker.position.set(pos.x, pos.y);

    const areaChanged = snappedAreId !== mapArt.areId;
    if (areaChanged) {
      snappedAreId = mapArt.areId;
      viewport.moveCenter(pos.x, pos.y);
    }
  };

  const applyFollow = (): void => {
    if (!following) {
      viewport.plugins.pause('follow');
      return;
    }

    const pos = firstActorPos();
    if (!isNothing(pos)) {
      followMarker.position.set(pos.x, pos.y);
      viewport.moveCenter(pos.x, pos.y);
    }

    viewport.follow(followMarker);
  };

  const paintCres = (): void => {
    if (!viewAlive) return;
    if (isNothing(snapshot)) return;

    syncCreSprites(actors, creSprites, snapshot, creArt);

    for (const [, actor] of snapshot.actors) {
      if (creArt.cre.has(actor.cre) || creArt.inflight.has(actor.cre)) continue;

      ensureCreArt(creArt, actor.cre, serverUrl, ghostDir)
        .then(() => {
          paintCres();
        })
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  };

  const paint = (): void => {
    if (isNothing(snapshot)) return;

    if (!isNothing(mapArt)) {
      walkGrid = paintedGrid(mapArt.are, mapArt.walkBase, snapshot.doors);
    }

    layoutCamera();
    rebuildTiles();

    if (!isNothing(walkGrid)) {
      const bounds = viewport.getVisibleBounds();
      drawUnpassableTiles(debug, walkGrid, bounds.x, bounds.y, bounds.width, bounds.height);
    }

    paintCres();
    onHudUpdate(snapshot.tick, snapshot.paused, snapshot.areId);
  };

  const paintVisible = (): void => {
    rebuildTiles();

    if (isNothing(walkGrid)) return;

    const bounds = viewport.getVisibleBounds();
    drawUnpassableTiles(debug, walkGrid, bounds.x, bounds.y, bounds.width, bounds.height);
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

  const panCamera = (ticker: Ticker): void => {
    if (following) return;
    if (!pointerOverCanvas) return;

    let sx = 0;
    let sy = 0;
    if (keys.left) sx -= 1;
    if (keys.right) sx += 1;
    if (keys.up) sy -= 1;
    if (keys.down) sy += 1;
    if (pointerScreen.x < EDGE_PX) sx -= 1;
    if (pointerScreen.x > viewport.screenWidth - EDGE_PX) sx += 1;
    if (pointerScreen.y < EDGE_PX) sy -= 1;
    if (pointerScreen.y > viewport.screenHeight - EDGE_PX) sy += 1;
    if (sx === 0 && sy === 0) return;

    const dist = Math.hypot(sx, sy);
    const dt = ticker.deltaMS / 1000;
    const scale = viewport.scaled;
    const worldDx = ((sx / dist) * PAN_CSS_PX_PER_SEC * dt) / scale;
    const worldDy = ((sy / dist) * PAN_CSS_PX_PER_SEC * dt) / scale;
    const center = viewport.center;
    viewport.moveCenter(center.x + worldDx, center.y + worldDy);
    viewport.plugins.get('clamp')?.update();

    paintVisible();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (!pointerOverCanvas) return;

    if (event.code === 'ArrowLeft') {
      keys.left = true;
      event.preventDefault();
    }
    if (event.code === 'ArrowRight') {
      keys.right = true;
      event.preventDefault();
    }
    if (event.code === 'ArrowUp') {
      keys.up = true;
      event.preventDefault();
    }
    if (event.code === 'ArrowDown') {
      keys.down = true;
      event.preventDefault();
    }
  };

  const onKeyUp = (event: KeyboardEvent): void => {
    if (event.code === 'ArrowLeft') keys.left = false;
    if (event.code === 'ArrowRight') keys.right = false;
    if (event.code === 'ArrowUp') keys.up = false;
    if (event.code === 'ArrowDown') keys.down = false;
  };

  const onPointerEnter = (): void => {
    pointerOverCanvas = true;
  };

  const onPointerLeave = (): void => {
    pointerOverCanvas = false;
  };

  const onTick = (ticker: Ticker): void => {
    viewport.update(ticker.elapsedMS);
    panCamera(ticker);
  };

  viewport.on('pointerdown', (event) => {
    const button = decodeMouseButton(event.button);
    if (isNothing(button)) return;
    const local = viewport.toWorld(event.global);
    onClick({ x: Math.floor(local.x), y: Math.floor(local.y), button });
  });

  viewport.on('globalpointermove', (event) => {
    pointerScreen.x = event.global.x;
    pointerScreen.y = event.global.y;
  });

  viewport.on('moved', () => {
    paintVisible();
  });
  viewport.on('zoomed', () => {
    paintVisible();
  });

  app.ticker.add(onTick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  app.canvas.addEventListener('pointerenter', onPointerEnter);
  app.canvas.addEventListener('pointerleave', onPointerLeave);

  app.renderer.on('resize', () => {
    syncViewportSize();
    paint();
  });

  const handleFromDaemon = (fromDaemon: FromDaemon): Maybe<Snapshot> => {
    if (fromDaemon.type === 'error') return snapshot;

    if (fromDaemon.type === 'snapshot') {
      const prevAre = isNothing(snapshot) ? nothing() : snapshot.areId;
      snapshot = fromDaemon.snapshot;

      const areaChanged = snapshot.areId !== prevAre;
      if (areaChanged) {
        clearCreSprites(actors, creSprites);
        loadArt(snapshot.areId); // TODO [snow]: that's a race
      }

      paint();

      return snapshot;
    }

    if (fromDaemon.type === 'tick' && !isNothing(snapshot)) {
      snapshot = {
        ...snapshot,
        tick: fromDaemon.tick,
        seq: fromDaemon.seq,
      };
      paintCres();
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
    setFollow: (on) => {
      following = on;
      applyFollow();
    },
    destroy: () => {
      viewAlive = false;
      loadGen += 1;
      app.ticker.remove(onTick);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      app.canvas.removeEventListener('pointerenter', onPointerEnter);
      app.canvas.removeEventListener('pointerleave', onPointerLeave);
      if (document.fullscreenElement === renderHost) {
        document.exitFullscreen().catch((err: unknown) => {
          console.error(err);
        });
      }
      clearTiles();
      clearCreSprites(actors, creSprites);
      if (viewport.parent) viewport.parent.removeChild(viewport);
      viewport.destroy({ children: true });
      app.destroy(true, { children: true, texture: true });
    },
  };
};
