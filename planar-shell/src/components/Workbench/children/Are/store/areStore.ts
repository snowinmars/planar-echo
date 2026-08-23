import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostAre, loadGhostAre } from './areApi';

import type { Maybe, GhostAre } from '@planar/shared';

export type AreStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  ares: string[];
  currentAreId: Maybe<string>;
  currentAre: Maybe<GhostAre>;
  loadAres: () => Promise<void>;
  loadAre: (areId: string) => Promise<void>;
  disposeAre: () => void;
}>;

export const useAreStore = create<AreStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  ares: [],
  currentAreId: nothing(),
  currentAre: nothing(),
  loadAres: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ ares: await listGhostAre(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ ares: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadAre: async (areId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentAreId: areId, currentAre: await loadGhostAre({ serverUrl, ghostDir, areId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentAreId: nothing(), currentAre: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeAre: () => set({ currentAreId: nothing(), currentAre: nothing() }),
}));
