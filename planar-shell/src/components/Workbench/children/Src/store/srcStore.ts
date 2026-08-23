import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostSrc, loadGhostSrc } from './srcApi';

import type { Maybe, GhostSrc } from '@planar/shared';

export type SrcStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  srcs: string[];
  currentSrcId: Maybe<string>;
  currentSrc: Maybe<GhostSrc>;
  loadSrcs: () => Promise<void>;
  loadSrc: (srcId: string) => Promise<void>;
  disposeSrc: () => void;
}>;

export const useSrcStore = create<SrcStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  srcs: [],
  currentSrcId: nothing(),
  currentSrc: nothing(),
  loadSrcs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ srcs: await listGhostSrc(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ srcs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadSrc: async (srcId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentSrcId: srcId, currentSrc: await loadGhostSrc({ serverUrl, ghostDir, srcId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentSrcId: nothing(), currentSrc: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeSrc: () => set({ currentSrcId: nothing(), currentSrc: nothing() }),
}));
