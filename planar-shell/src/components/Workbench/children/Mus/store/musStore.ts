import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostMus, loadGhostMus } from './musApi';

import type { GhostMus, Maybe } from '@planar/shared';

export type MusStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  muss: string[];
  currentMusId: Maybe<string>;
  currentMus: Maybe<GhostMus>;
  loadMuss: () => Promise<void>;
  loadMus: (musId: string) => Promise<void>;
  disposeMus: () => void;
}>;

export const useMusStore = create<MusStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  muss: [],
  currentMusId: nothing(),
  currentMus: nothing(),
  loadMuss: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ muss: await listGhostMus(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ muss: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadMus: async (musId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentMusId: musId, currentMus: await loadGhostMus({ serverUrl, ghostDir, musId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentMusId: nothing(), currentMus: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeMus: () => set({ currentMusId: nothing(), currentMus: nothing() }),
}));
