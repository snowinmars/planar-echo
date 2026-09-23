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

import { foldPatches } from '@planar/kernel';
import { isNothing, nothing, PLAYER_ACTOR_ID } from '@planar/shared';

import { bootClientMods, clientHookOrder } from '../mods/bootClientMods.js';
import { createAssetPump } from '../mods/createAssetPump.js';
import { bagOf, createClientHost, wipeClientStorage } from '../mods/createClientHost.js';
import { createClientGhostReader } from '../mods/ghostReader.js';

import type { Ticker } from 'pixi.js';

import type { FromDaemon, Maybe, Patch, Point, Snapshot } from '@planar/shared';

import type { ClientSession } from '../mods/createClientHost.js';
import type { PlayView } from './types.js';

export type PlayPointerClick = Point & Readonly<{
  button: 'left' | 'right';
}>;

const EDGE_PX = 40;
const PAN_CSS_PX_PER_SEC = 500;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

const decodeMouseButton = (button: number): Maybe<PlayPointerClick['button']> => {
  if (button === 0) return 'left';
  if (button === 2) return 'right';
  return nothing();
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

  const area = new Container();
  area.eventMode = 'none';
  const bodies = new Container();
  bodies.eventMode = 'none';
  bodies.sortableChildren = true;
  const overlay = new Graphics();
  overlay.eventMode = 'none';
  const followMarker = new Container();
  followMarker.eventMode = 'none';

  viewport.addChild(area);
  viewport.addChild(bodies);
  viewport.addChild(overlay);
  viewport.addChild(followMarker);

  const session = {
    snapshot: nothing(),
    mapWidth: 0,
    mapHeight: 0,
    bags: new Map(),
  } as unknown as ClientSession;

  const pixi = { Sprite, Texture, Rectangle, Assets, Container, Graphics };
  const ghost = createClientGhostReader(serverUrl, ghostDir, () => (
    isNothing(session.snapshot) ? '' : session.snapshot.areId
  ));
  const pump = createAssetPump({
    ghost,
    serverUrl,
    pixiAssets: Assets,
  });

  session.host = createClientHost({
    session,
    layers: { area, bodies, overlay },
    pixi,
    assets: pump.assets,
    viewport,
    app,
  });

  const { active, mods } = await bootClientMods({
    serverUrl,
  });

  let areaReady = false;
  let following = false;
  let snappedAreId: Maybe<string> = nothing();
  let pointerOverCanvas = false;
  const pointerScreen = { x: 0, y: 0 };
  const keys = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  const playerPos = (): Maybe<{ x: number; y: number }> => {
    if (isNothing(session.snapshot)) return nothing();
    const found = session.snapshot.entities.find(row => row.id === PLAYER_ACTOR_ID);
    if (!found) return nothing();
    return found.pos;
  };

  const syncViewportSize = (): void => {
    viewport.resize(
      app.screen.width,
      app.screen.height,
      session.mapWidth || app.screen.width,
      session.mapHeight || app.screen.height,
    );
  };

  const layoutCamera = (): void => {
    if (isNothing(session.snapshot)) return;
    syncViewportSize();
    const pos = playerPos();
    if (isNothing(pos)) return;
    followMarker.position.set(pos.x, pos.y);
    const areaChanged = snappedAreId !== session.snapshot.areId;
    if (areaChanged) {
      snappedAreId = session.snapshot.areId;
      viewport.moveCenter(pos.x, pos.y);
    }
  };

  const applyFollow = (): void => {
    if (!following) {
      viewport.plugins.pause('follow');
      return;
    }
    const pos = playerPos();
    if (!isNothing(pos)) {
      followMarker.position.set(pos.x, pos.y);
      viewport.moveCenter(pos.x, pos.y);
    }
    viewport.follow(followMarker);
  };

  const runHook = (hook: 'onAreaUnload' | 'onPatches' | 'onFrame', patches?: Patch[]): void => {
    for (const mod of clientHookOrder(active, mods, hook)) {
      const bag = bagOf(session, mod.manifest.id);
      switch (hook) {
        case 'onAreaUnload':
          mod.exports.onAreaUnload?.(session.host, { bag })?.catch((err: unknown) => {
            console.error(err);
          });
          break;
        case 'onPatches':
          mod.exports.onPatches?.(session.host, { bag, patches: patches ?? [] });
          break;
        case 'onFrame': {
          const result: unknown = mod.exports.onFrame?.(session.host, { bag });
          const thenable = result !== undefined && result !== null && typeof result === 'object' && 'then' in result;
          if (thenable) {
            console.error(`mod '${mod.manifest.id}' onFrame returned a Promise`);
          }
          break;
        }
      }
    }
  };

  const drainAssets = async (): Promise<void> => {
    await pump.assets.waitAllLoadings();
  };

  const hud = (): void => {
    if (isNothing(session.snapshot)) return;
    onHudUpdate(session.snapshot.tick, session.snapshot.paused, session.snapshot.areId);
  };

  const onArea = async (): Promise<void> => {
    areaReady = false;
    runHook('onAreaUnload');
    pump.unloadAll();
    wipeClientStorage(session);
    overlay.clear();
    for (const mod of clientHookOrder(active, mods, 'onAreaLoad')) {
      await mod.exports.onAreaLoad?.(session.host, { bag: bagOf(session, mod.manifest.id) });
    }
    await drainAssets();
    if (!isNothing(session.snapshot)) {
      const published: Patch[] = Object.entries(session.snapshot.mods).map(([modId, row]) => ({
        type: 'mod/upsert',
        modId,
        row,
      }));
      if (published.length > 0) runHook('onPatches', published);
      await drainAssets();
    }
    areaReady = true;
    layoutCamera();
    applyFollow();
    hud();
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
    overlay.clear();
    if (!areaReady) return;
    runHook('onFrame');
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

  app.ticker.add(onTick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  app.canvas.addEventListener('pointerenter', onPointerEnter);
  app.canvas.addEventListener('pointerleave', onPointerLeave);

  app.renderer.on('resize', () => {
    syncViewportSize();
  });

  const handleFromDaemon = (fromDaemon: FromDaemon): Maybe<Snapshot> => {
    if (fromDaemon.type === 'error') return session.snapshot;

    if (fromDaemon.type === 'snapshot') {
      const prevAre = isNothing(session.snapshot) ? nothing() : session.snapshot.areId;
      session.snapshot = fromDaemon.snapshot;
      const areaChanged = session.snapshot.areId !== prevAre;
      if (areaChanged) {
        onArea().catch((err: unknown) => console.error(err));
      }
      else {
        layoutCamera();
        hud();
      }
      return session.snapshot;
    }

    if (fromDaemon.type === 'tick' && !isNothing(session.snapshot)) {
      session.snapshot = {
        ...session.snapshot,
        tick: fromDaemon.tick,
        seq: fromDaemon.seq,
      };
      hud();
      return session.snapshot;
    }

    if (fromDaemon.type === 'patches' && !isNothing(session.snapshot)) {
      session.snapshot = {
        ...foldPatches(session.snapshot, fromDaemon.patches),
        seq: fromDaemon.seq,
        tick: fromDaemon.tick,
      };
      runHook('onPatches', fromDaemon.patches);
      layoutCamera();
      hud();
      return session.snapshot;
    }

    return session.snapshot;
  };

  return {
    handleFromDaemon,
    setFollow: (on) => {
      following = on;
      applyFollow();
    },
    destroy: () => {
      areaReady = false;
      pump.unloadAll();
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
      if (viewport.parent) viewport.parent.removeChild(viewport);
      viewport.destroy({ children: true });
      app.destroy(true, { children: true, texture: true });
    },
  };
};
