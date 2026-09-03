import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostBmp, loadGhostBmp } from './bmpApi';

import type { GhostBmp, Maybe } from '@planar/shared';

export type BmpStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  bmps: string[];
  currentBmpId: Maybe<string>;
  currentBmp: Maybe<GhostBmp>;
  loadBmps: () => Promise<void>;
  loadBmp: (bmpId: string) => Promise<void>;
  disposeBmp: () => void;
}>;

export const useBmpStore = create<BmpStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  bmps: [],
  currentBmpId: nothing(),
  currentBmp: nothing(),
  loadBmps: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ bmps: await listGhostBmp(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bmps: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadBmp: async (bmpId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentBmpId: bmpId, currentBmp: await loadGhostBmp({ serverUrl, ghostDir, bmpId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentBmpId: nothing(), currentBmp: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeBmp: () => set({ currentBmpId: nothing(), currentBmp: nothing() }),
}));
