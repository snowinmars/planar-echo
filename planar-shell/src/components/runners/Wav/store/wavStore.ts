import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostWav, loadGhostWav } from './wavApi';

import type { Maybe, GhostWav } from '@planar/shared';

export type WavStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  wavs: string[];
  currentWavId: Maybe<string>;
  currentWav: Maybe<GhostWav>;
  loadWavs: () => Promise<void>;
  loadWav: (wavId: string) => Promise<void>;
  disposeWav: () => void;
}>;

export const useWavStore = create<WavStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  wavs: [],
  currentWavId: nothing(),
  currentWav: nothing(),
  loadWavs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ wavs: await listGhostWav(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ wavs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadWav: async (wavId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentWavId: wavId, currentWav: await loadGhostWav({ serverUrl, ghostDir, wavId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentWavId: nothing(), currentWav: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeWav: () => set({ currentWavId: nothing(), currentWav: nothing() }),
}));
