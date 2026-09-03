import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostTwoda, loadGhostTwoda } from './twodaApi';

import type { GhostTwoda, Maybe } from '@planar/shared';

export type TwodaStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  twodas: string[];
  currentTwodaId: Maybe<string>;
  currentTwoda: Maybe<GhostTwoda>;
  loadTwodas: () => Promise<void>;
  loadTwoda: (twodaId: string) => Promise<void>;
  disposeTwoda: () => void;
}>;

export const useTwodaStore = create<TwodaStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  twodas: [],
  currentTwodaId: nothing(),
  currentTwoda: nothing(),
  loadTwodas: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ twodas: await listGhostTwoda(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ twodas: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadTwoda: async (twodaId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentTwodaId: twodaId, currentTwoda: await loadGhostTwoda({ serverUrl, ghostDir, twodaId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentTwodaId: nothing(), currentTwoda: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeTwoda: () => set({ currentTwodaId: nothing(), currentTwoda: nothing() }),
}));
