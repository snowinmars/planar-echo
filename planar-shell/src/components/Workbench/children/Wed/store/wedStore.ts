import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostWed, loadGhostWed } from './wedApi';

import type { GhostWed, Maybe } from '@planar/shared';

export type WedStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;

  weds: string[];
  currentWedId: Maybe<string>;
  currentWed: Maybe<GhostWed>;

  loadWeds: () => Promise<void>;
  loadWed: (wedId: string) => Promise<void>;
  disposeWed: () => void;
}>;

export const useWedStore = create<WedStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,

  weds: [],
  currentWedId: nothing(),
  currentWed: nothing(),

  loadWeds: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostWed(serverUrl, ghostDir);
      set({ weds: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ weds: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadWed: async (wedId: string) => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostWed({ serverUrl, ghostDir, wedId });
      set({
        currentWedId: wedId,
        currentWed: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentWedId: nothing(),
        currentWed: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeWed: () => set({
    currentWedId: nothing(),
    currentWed: nothing(),
  }),
}));
