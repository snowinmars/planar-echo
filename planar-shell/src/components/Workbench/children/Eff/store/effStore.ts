import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostEff, loadGhostEff } from './effApi';

import type { GhostEff, Maybe } from '@planar/shared';

export type EffStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  effs: string[];
  currentEffId: Maybe<string>;
  currentEff: Maybe<GhostEff>;
  loadEffs: () => Promise<void>;
  loadEff: (effId: string) => Promise<void>;
  disposeEff: () => void;
}>;

export const useEffStore = create<EffStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  effs: [],
  currentEffId: nothing(),
  currentEff: nothing(),
  loadEffs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ effs: await listGhostEff(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ effs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadEff: async (effId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentEffId: effId, currentEff: await loadGhostEff({ serverUrl, ghostDir, effId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentEffId: nothing(), currentEff: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeEff: () => set({ currentEffId: nothing(), currentEff: nothing() }),
}));
