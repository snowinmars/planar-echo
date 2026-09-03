import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostPvrz, loadGhostPvrz } from './pvrzApi';

import type { GhostPvr, Maybe } from '@planar/shared';

export type PvrzStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;

  pvrzs: string[];
  currentPvrzId: Maybe<string>;
  currentPvrz: Maybe<GhostPvr>;

  loadPvrzs: () => Promise<void>;
  loadPvrz: (pvrzId: string) => Promise<void>;
  disposePvrz: () => void;
}>;

export const usePvrzStore = create<PvrzStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,

  pvrzs: [],
  currentPvrzId: nothing(),
  currentPvrz: nothing(),

  loadPvrzs: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostPvrz(serverUrl, ghostDir);
      set({ pvrzs: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ pvrzs: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadPvrz: async (pvrzId: string) => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostPvrz({ serverUrl, ghostDir, pvrzId });
      set({
        currentPvrzId: pvrzId,
        currentPvrz: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentPvrzId: nothing(),
        currentPvrz: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposePvrz: () => set({
    currentPvrzId: nothing(),
    currentPvrz: nothing(),
  }),
}));
