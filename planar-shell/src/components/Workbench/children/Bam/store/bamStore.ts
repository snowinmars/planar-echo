import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostBam, loadGhostBam } from './bamApi';

import type { Maybe, GhostBam } from '@planar/shared';

export type BamStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  bams: string[];
  currentBamId: Maybe<string>;
  currentBam: Maybe<GhostBam>;
  loadBams: () => Promise<void>;
  loadBam: (bamId: string) => Promise<void>;
  disposeBam: () => void;
}>;

export const useBamStore = create<BamStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  bams: [],
  currentBamId: nothing(),
  currentBam: nothing(),
  loadBams: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ bams: await listGhostBam(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bams: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadBam: async (bamId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentBamId: bamId, currentBam: await loadGhostBam({ serverUrl, ghostDir, bamId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentBamId: nothing(), currentBam: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeBam: () => set({ currentBamId: nothing(), currentBam: nothing() }),
}));
