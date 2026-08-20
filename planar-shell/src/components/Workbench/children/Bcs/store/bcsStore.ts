import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostBcs, loadGhostBcs } from './bcsApi';

import type { Maybe, GhostBcs } from '@planar/shared';

export type BcsStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;

  bcss: string[];
  currentBcsId: Maybe<string>;
  currentBcs: Maybe<GhostBcs>;

  loadBcss: () => Promise<void>;
  loadBcs: (bcsId: string) => Promise<void>;
  disposeBcs: () => void;
}>;

export const useBcsStore = create<BcsStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,

  bcss: [],
  currentBcsId: nothing(),
  currentBcs: nothing(),

  loadBcss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostBcs(serverUrl, ghostDir);
      set({ bcss: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bcss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadBcs: async (bcsId: string) => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostBcs({ serverUrl, ghostDir, bcsId });
      set({
        currentBcsId: bcsId,
        currentBcs: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentBcsId: nothing(),
        currentBcs: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeBcs: () => set({
    currentBcsId: nothing(),
    currentBcs: nothing(),
  }),
}));
