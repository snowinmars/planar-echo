import type { Point } from '../geometry.js';
import type { GhostAre } from '../ghost/are.types.js';
import type { GhostBam } from '../ghost/bam.types.js';
import type { GhostCre } from '../ghost/cre.types.js';
import type { GhostIniAnimation } from '../ghost/ini.types.js';
import type { GhostPvr } from '../ghost/pvr.types.js';
import type { GhostTis } from '../ghost/tis.types.js';
import type { GhostWed } from '../ghost/wed.types.js';
import type { Maybe } from '../maybe.js';
import type { ClientAssets } from './assets.js';
import type { Envelope } from './envelope.js';
import type { EntityId, InputCommand, Meta, Patch, WalkGrid } from './protocol.js';
import type { ConsumableHookEffects, HookEffects } from './worldEffect.js';

export type ServerGhostReader = Readonly<{
  load: Readonly<{
    animation: (animationId: number) => Promise<Maybe<GhostIniAnimation>>;
    are: (areId: string) => Promise<GhostAre>;
    cre: (creId: string) => Promise<GhostCre>;
  }>;
  current: Readonly<{
    are: () => Promise<GhostAre>;
  }>;
}>;

export type ClientGhostReader = Readonly<{
  current: Readonly<{
    are: () => Promise<GhostAre>;
  }>;
  load: Readonly<{
    animation: (animationId: number) => Promise<Maybe<GhostIniAnimation>>;
    are: (areId: string) => Promise<GhostAre>;
    bam: (bamId: string) => Promise<GhostBam>;
    cre: (creId: string) => Promise<GhostCre>;
    pvrz: (pvrzId: string) => Promise<GhostPvr>;
    tis: (tisId: string) => Promise<GhostTis>;
    wed: (wedId: string) => Promise<GhostWed>;
  }>;
}>;

/**
 * Camera AABB in world px.
 */
export type VisibleBounds = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

/**
 * Shell owns these Pixi layers.
 */
export type ClientLayerName = 'area' | 'bodies' | 'overlay';

/**
 * Isolated per-mod RAM.
 */
export type ModBag = Record<string, unknown>;

/**
 * Read API for mods server.js. World writes go through WorldEffect.
 */
export type ServerModHost = Readonly<{
  entities: () => Envelope[];
  entity: (id: EntityId) => Maybe<Envelope>;
  meta: () => Meta;
  searchWalk: (ignoreId: EntityId) => WalkGrid;
  walk: () => WalkGrid;
  serverGhostReader: ServerGhostReader;
}>;

/**
 * Shell API for mods client.js.
 */
export type ClientModHost = Readonly<{
  assets: ClientAssets;
  entities: () => Envelope[];
  entity: (id: EntityId) => Maybe<Envelope>;
  meta: () => Meta;
  setMapSize: (width: number, height: number) => void;
  visibleBounds: () => VisibleBounds;
  layers: Readonly<Record<ClientLayerName, unknown>>;
  pixi: unknown; // I need a language to talk between mods and shell, so why reinvent pixi?
}>;

export type ServerOnAreaLoadCtx = Readonly<{
  bag: ModBag;
}>;

export type ServerOnAreaUnloadCtx = Readonly<{
  bag: ModBag;
}>;

export type ServerOnTickCtx = Readonly<{
  bag: ModBag;
}>;

export type ServerOnCommandCtx = Readonly<{
  bag: ModBag;
  command: InputCommand;
}>;

export type ServerFloorOverlayCtx = Readonly<{
  bag: ModBag;
  walk: WalkGrid;
}>;

export type ServerOccupancyCtx = Readonly<{
  bag: ModBag;
  walk: WalkGrid;
  ignoreId: EntityId;
}>;

export type ClientOnAreaLoadCtx = Readonly<{
  bag: ModBag;
}>;

export type ClientOnAreaUnloadCtx = Readonly<{
  bag: ModBag;
}>;

export type ClientOnFrameCtx = Readonly<{
  bag: ModBag;
}>;

export type ClientOnPatchesCtx = Readonly<{
  bag: ModBag;
  patches: Patch[];
}>;

/**
 * Named exports from server.js.
 */
export type ServerModExports = Readonly<{
  onAreaLoad?: Maybe<(host: ServerModHost, ctx: ServerOnAreaLoadCtx) => Promise<HookEffects>>;
  onAreaUnload?: Maybe<(host: ServerModHost, ctx: ServerOnAreaUnloadCtx) => Promise<void>>;
  onCommand?: Maybe<(host: ServerModHost, ctx: ServerOnCommandCtx) => ConsumableHookEffects>;
  onTick?: Maybe<(host: ServerModHost, ctx: ServerOnTickCtx) => HookEffects>;
  floorOverlay?: Maybe<(host: ServerModHost, ctx: ServerFloorOverlayCtx) => Point[]>;
  occupancy?: Maybe<(host: ServerModHost, ctx: ServerOccupancyCtx) => Point[]>;
}>;

/**
 *  Named exports from client.js.
 */
export type ClientModExports = Readonly<{
  onAreaLoad?: Maybe<(host: ClientModHost, ctx: ClientOnAreaLoadCtx) => Promise<void>>;
  onAreaUnload?: Maybe<(host: ClientModHost, ctx: ClientOnAreaUnloadCtx) => Promise<void>>;
  onFrame?: Maybe<(host: ClientModHost, ctx: ClientOnFrameCtx) => void>;
  onPatches?: Maybe<(host: ClientModHost, ctx: ClientOnPatchesCtx) => void>;
}>;
