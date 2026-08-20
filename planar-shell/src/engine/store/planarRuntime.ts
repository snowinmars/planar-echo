import { createContext, useContext, useEffect } from 'react';
import { useStore } from 'zustand';
import { createPlanarRuntime } from './createPlanarRuntime';
import { planarStoreId } from './planarRuntime.types';

import type { LocalStorageStore } from '@/components/Workbench/children/Dlg/store/localStorageStore.types';
import type { TlkStore } from '@/components/Workbench/children/Dlg/store/tlkStore.types';
import type { PlanarRuntime, PlanarStoreId } from './planarRuntime.types';

export const planarCoreModules = [
  planarStoreId.localStorage,
  planarStoreId.tlk,
] as const;

export const appPlanarRuntime = createPlanarRuntime();
export const PlanarRuntimeContext = createContext<PlanarRuntime>(appPlanarRuntime);
export const useRuntime = (): PlanarRuntime => useContext(PlanarRuntimeContext);

export const useFeatureLease = (modules: readonly PlanarStoreId[]): void => {
  useEffect(() => {
    const releases = modules.map(module => appPlanarRuntime.acquire(module));
    return () => {
      for (const release of releases.reverse()) release();
    };
  }, [modules]);
};

export const useTlkStore = <T>(selector: (state: TlkStore) => T): T => (
  useStore(useRuntime().getStore<TlkStore>(planarStoreId.tlk), selector)
);

export const useLocalStorageStore = <T>(selector: (state: LocalStorageStore) => T): T => (
  useStore(useRuntime().getStore<LocalStorageStore>(planarStoreId.localStorage), selector)
);

export { planarStoreId };
export type { PlanarRuntime, PlanarStoreId };
