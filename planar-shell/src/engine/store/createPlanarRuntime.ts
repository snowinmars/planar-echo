import { createStore } from 'zustand/vanilla';
import { nothing } from '@planar/shared';
import { createDlgStore } from '@/components/runners/Dlg/store/dlgStore';
import { createDlgViewStore } from '@/components/runners/Dlg/store/dlgViewStore';
import { createGameHistoryStore } from '@/components/runners/Dlg/store/gameHistoryStore';
import { createLocalStorageStore } from '@/components/runners/Dlg/store/localStorageStore';
import { createTlkStore } from '@/components/runners/Dlg/store/tlkStore';
import { planarStoreId } from './planarRuntime.types';

import type { StoreApi } from 'zustand/vanilla';
import type { DlgViewStore } from '@/components/runners/Dlg/store/dlgViewStore.types';
import type { GameHistoryStore } from '@/components/runners/Dlg/store/gameHistoryStore.types';
import type { LocalStorageStore } from '@/components/runners/Dlg/store/localStorageStore.types';
import type { TlkStore } from '@/components/runners/Dlg/store/tlkStore.types';
import type {
  DisposeFunction,
  PlanarRuntime,
  PlanarStoreId,
  RuntimeEntry,
  StoreDefinition,
} from './planarRuntime.types';

const definitions: Record<PlanarStoreId, StoreDefinition> = {
  [planarStoreId.localStorage]: {
    dependencies: [],
    create: () => createStore(createLocalStorageStore),
    start: store => (store as StoreApi<LocalStorageStore>).getState().start(),
  },
  [planarStoreId.tlk]: {
    dependencies: [planarStoreId.localStorage],
    create: runtime => createStore(createTlkStore(runtime)),
    start: store => (store as StoreApi<TlkStore>).getState().start(),
  },
  [planarStoreId.gameHistory]: {
    dependencies: [planarStoreId.localStorage, planarStoreId.tlk],
    create: runtime => createStore(createGameHistoryStore(runtime)),
    start: store => (store as StoreApi<GameHistoryStore>).getState().start(),
  },
  [planarStoreId.dlg]: {
    dependencies: [planarStoreId.localStorage, planarStoreId.tlk, planarStoreId.gameHistory],
    create: runtime => createStore(createDlgStore(runtime)),
  },
  [planarStoreId.dlgView]: {
    dependencies: [planarStoreId.dlg, planarStoreId.localStorage, planarStoreId.tlk],
    create: runtime => createStore(createDlgViewStore(runtime)),
    start: store => (store as StoreApi<DlgViewStore>).getState().start(),
  },
};

export const createPlanarRuntime = (): PlanarRuntime => {
  const entries = new Map<PlanarStoreId, RuntimeEntry>();

  const getStore = <T>(id: PlanarStoreId): StoreApi<T> => {
    const existing = entries.get(id);
    if (existing) return existing.store as StoreApi<T>;

    const definition = definitions[id];
    for (const dependency of definition.dependencies) getStore(dependency);

    const entry: RuntimeEntry = {
      store: definition.create(runtime),
      leases: 0,
      dispose: nothing(),
    };
    entries.set(id, entry);
    return entry.store as StoreApi<T>;
  };

  const getEntry = (id: PlanarStoreId): RuntimeEntry => {
    getStore(id);
    return entries.get(id)!;
  };

  const acquire = (id: PlanarStoreId): DisposeFunction => {
    const definition = definitions[id];
    const disposeDependencies = definition.dependencies.map(dependency => acquire(dependency));
    const entry = getEntry(id);

    if (entry.leases === 0) entry.dispose = definition.start?.(entry.store);
    entry.leases++;

    let released = false;
    return (): void => {
      if (released) return;
      released = true;

      entry.leases--;
      if (entry.leases === 0) {
        entry.dispose?.();
        entry.dispose = nothing();
      }

      for (const disposeDependency of disposeDependencies.reverse()) disposeDependency();
    };
  };

  const runtime: PlanarRuntime = {
    getStore,
    acquire,
  };

  return runtime;
};
