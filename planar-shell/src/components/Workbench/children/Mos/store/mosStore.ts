import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostMos, loadGhostMos } from './mosApi';

import type { GhostMos, Maybe } from '@planar/shared';

export type MosStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;

  moss: string[];
  currentMosId: Maybe<string>;
  currentMos: Maybe<GhostMos>;

  loadMoss: () => Promise<void>;
  loadMos: (mosId: string) => Promise<void>;
  disposeMos: () => void;
}>;

export const useMosStore = create<MosStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,

  moss: [],
  currentMosId: nothing(),
  currentMos: nothing(),

  loadMoss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostMos(serverUrl, ghostDir);
      set({ moss: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ moss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadMos: async (mosId: string) => {
    set({ loading: true });

    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostMos({ serverUrl, ghostDir, mosId });
      set({
        currentMosId: mosId,
        currentMos: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentMosId: nothing(),
        currentMos: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeMos: () => set({
    currentMosId: nothing(),
    currentMos: nothing(),
  }),
}));
