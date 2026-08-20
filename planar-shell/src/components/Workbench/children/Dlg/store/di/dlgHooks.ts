import { useStore } from 'zustand';
import { planarStoreId, useRuntime } from '@/engine/store/planarRuntime';

import type { StoreApi } from 'zustand/vanilla';
import type { DlgStore } from '../dlgStore.types';
import type { DlgViewStore } from '../dlgViewStore.types';
import type { GameHistoryStore } from '../gameHistoryStore.types';

export const dlgFeatureModules = [
  planarStoreId.dlgView,
  planarStoreId.gameHistory,
] as const;

export const useDlgStore = <T>(selector: (state: DlgStore) => T): T => (
  useStore(useRuntime().getStore<DlgStore>(planarStoreId.dlg), selector)
);

export const useDlgStoreApi = (): StoreApi<DlgStore> => (
  useRuntime().getStore<DlgStore>(planarStoreId.dlg)
);

export const useDlgViewStore = <T>(selector: (state: DlgViewStore) => T): T => (
  useStore(useRuntime().getStore<DlgViewStore>(planarStoreId.dlgView), selector)
);

export const useGameHistoryStore = <T>(selector: (state: GameHistoryStore) => T): T => (
  useStore(useRuntime().getStore<GameHistoryStore>(planarStoreId.gameHistory), selector)
);
