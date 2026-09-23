import { paintCell, rewriteWalkGrid } from '@planar/kernel';
import { animationIdToHex4, isNothing, just, maybe, nothing, slotOfQuery, UNPASSABLE_WALK } from '@planar/shared';

import { loadGhostAnimation, loadGhostAre, loadGhostCre } from '../loadGhost/index.js';

import type { World } from '@planar/kernel';
import type {
  ActiveJsonMods,
  ComposedQueryName,
  EntityId,
  InputCommand,
  Maybe,
  ModBag,
  ModManifest,
  Patch,
  Point,
  QueryName,
  ServerModExports,
  ServerModHost,
  SlotBoundQueryName,
  WalkGrid,
} from '@planar/shared';

export type LoadedServerMod = Readonly<{
  manifest: ModManifest;
  exports: ServerModExports;
}>;

export type HostSession = {
  ghostDir: string;
  world: World;
  areCache: Maybe<Awaited<ReturnType<typeof loadGhostAre>>>;
  bags: Map<string, ModBag>;
  published: Map<string, unknown>;
  emitQueue: InputCommand[];
  pending: Patch[];
  active: ActiveJsonMods;
  mods: LoadedServerMod[];
  host: ServerModHost;
  blocked: boolean;
  querying: boolean;
};

export const bagOf = (session: HostSession, modId: string): ModBag => {
  const existing = session.bags.get(modId);
  if (existing) return existing;

  const bag: ModBag = {};
  session.bags.set(modId, bag);
  return bag;
};

export const wipeStorage = (session: HostSession): void => {
  session.bags.clear();
  session.published.clear();
  session.areCache = nothing();
};

const applyBlockedCells = (walk: WalkGrid, cells: Point[]): void => {
  for (const cell of cells) {
    paintCell(walk, cell, UNPASSABLE_WALK, 'set');
  }
};

const queryOrder = (session: HostSession, query: ComposedQueryName): LoadedServerMod[] => {
  const ids = session.active.queries[query] ?? [];
  const byId = new Map(session.mods.map(mod => [mod.manifest.id, mod]));
  const ordered: LoadedServerMod[] = [];
  for (const id of ids) {
    const enabled = session.active.enabled[id];
    if (!enabled) continue;

    const mod = byId.get(id);
    if (!mod) continue;

    const declaresQuery = mod.manifest.queries.includes(query);
    if (!declaresQuery) continue;

    const serverSide = mod.manifest.sides.includes('server');
    if (!serverSide) continue;

    ordered.push(mod);
  }
  return ordered;
};

const slotBoundMod = (session: HostSession, query: SlotBoundQueryName): Maybe<LoadedServerMod> => {
  const slot = slotOfQuery(query);
  const id = session.active.slots[slot];
  const unassigned = isNothing(id);
  if (unassigned) return nothing();

  const disabled = !session.active.enabled[id];
  if (disabled) return nothing();

  const byId = new Map(session.mods.map(mod => [mod.manifest.id, mod]));
  const mod = byId.get(id);
  if (!mod) return nothing();

  const declaresQuery = mod.manifest.queries.includes(query);
  if (!declaresQuery) return nothing();

  const serverSide = mod.manifest.sides.includes('server');
  if (!serverSide) return nothing();

  return maybe(mod);
};

const isPoint = (value: unknown): value is Point => {
  const notObject = typeof value !== 'object' || value === null;
  if (notObject) return false;

  const cell = value as { x?: unknown; y?: unknown };
  return typeof cell.x === 'number' && typeof cell.y === 'number';
};

const assertPointList = (modId: string, query: QueryName, cells: unknown): Point[] => {
  const notArray = !Array.isArray(cells);
  if (notArray) throw new Error(`mod '${modId}' ${query} must return Point[]`);

  const out: Point[] = [];
  for (const cell of cells) {
    const invalidPoint = !isPoint(cell);
    if (invalidPoint) throw new Error(`mod '${modId}' ${query} must return Point[]`);
    out.push(cell);
  }
  return out;
};

export const rematerializeFloor = (session: HostSession): void => {
  session.world.walkGrid.grid.set(session.world.walkBase);
  const walkBaseView = rewriteWalkGrid(session.world.walkGrid, session.world.walkBase);
  session.querying = true;
  try {
    for (const mod of queryOrder(session, 'floorOverlay')) {
      const missing = isNothing(mod.exports.floorOverlay);
      if (missing) continue;

      const cells = assertPointList(
        mod.manifest.id,
        'floorOverlay',
        mod.exports.floorOverlay(session.host, {
          bag: bagOf(session, mod.manifest.id),
          walk: walkBaseView,
        }),
      );
      applyBlockedCells(session.world.walkGrid, cells);
    }
  }
  finally {
    session.querying = false;
  }
};

export const createServerHost = (session: HostSession): ServerModHost => {
  const host: ServerModHost = {
    entities: () => [...session.world.entities.values()],
    entity: (id: EntityId) => session.world.entities.get(id),
    meta: () => session.world.meta,
    walk: () => {
      const insideQuery = session.querying;
      if (insideQuery) throw new Error('host.walk() is forbidden inside a query');
      return session.world.walkGrid;
    },
    searchWalk: (ignoreId: EntityId) => {
      const insideQuery = session.querying;
      if (insideQuery) throw new Error('host.searchWalk() is forbidden inside a query');

      const walk = session.world.walkGrid;
      const grid = Uint8Array.from(walk.grid);
      const painted = rewriteWalkGrid(walk, grid);

      session.querying = true;
      try {
        const mod = slotBoundMod(session, 'occupancy');
        const missingMod = isNothing(mod);
        if (!missingMod) {
          const missing = isNothing(mod.exports.occupancy);
          if (!missing) {
            const cells = assertPointList(
              mod.manifest.id,
              'occupancy',
              mod.exports.occupancy(host, {
                bag: bagOf(session, mod.manifest.id),
                walk,
                ignoreId,
              }),
            );
            applyBlockedCells(painted, cells);
          }
        }
      }
      finally {
        session.querying = false;
      }

      return painted;
    },
    serverGhostReader: {
      current: {
        are: async () => {
          const cached = !isNothing(session.areCache);
          if (cached) return just(session.areCache);

          const loaded = await loadGhostAre(session.ghostDir, session.world.meta.areId);
          session.areCache = loaded;
          return loaded;
        },
      },
      load: {
        are: async (areId: string) => {
          return loadGhostAre(session.ghostDir, areId);
        },
        cre: async (creId: string) => loadGhostCre(session.ghostDir, creId),
        animation: async (animationId: number) => {
          return loadGhostAnimation(session.ghostDir, animationIdToHex4(animationId));
        },
      },
    },
  };

  return host;
};
