import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostIds, loadGhostIds } from './idsApi';

import type { Maybe, GhostIds } from '@planar/shared';

export type IdsStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  idss: string[];
  currentIdsId: Maybe<string>;
  currentIds: Maybe<GhostIds>;
  loadIdss: () => Promise<void>;
  loadIds: (idsId: string) => Promise<void>;
  disposeIds: () => void;
}>;

export const useIdsStore = create<IdsStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  idss: [],
  currentIdsId: nothing(),
  currentIds: nothing(),
  loadIdss: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ idss: await listGhostIds(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ idss: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadIds: async (idsId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentIdsId: idsId, currentIds: await loadGhostIds({ serverUrl, ghostDir, idsId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentIdsId: nothing(), currentIds: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeIds: () => set({ currentIdsId: nothing(), currentIds: nothing() }),
}));
