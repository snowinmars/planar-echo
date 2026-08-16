import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostTis, loadGhostTis } from './tisApi';

import type { Maybe, GhostTis } from '@planar/shared';

export type TisStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;

  tiss: string[];
  currentTisId: Maybe<string>;
  currentTis: Maybe<GhostTis>;

  loadTiss: () => Promise<void>;
  loadTis: (tisId: string) => Promise<void>;
  disposeTis: () => void;
}>;

export const useTisStore = create<TisStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,

  tiss: [],
  currentTisId: nothing(),
  currentTis: nothing(),

  loadTiss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostTis(serverUrl, ghostDir);
      set({ tiss: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ tiss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadTis: async (tisId: string) => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostTis({ serverUrl, ghostDir, tisId });
      set({
        currentTisId: tisId,
        currentTis: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentTisId: nothing(),
        currentTis: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeTis: () => set({
    currentTisId: nothing(),
    currentTis: nothing(),
  }),
}));
