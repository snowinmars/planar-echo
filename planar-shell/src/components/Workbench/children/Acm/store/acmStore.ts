import { create } from 'zustand';
import { nothing } from '@planar/shared';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { listGhostAcm, loadGhostAcm } from './acmApi';

import type { Maybe, GhostAcm } from '@planar/shared';

export type AcmStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  acms: string[];
  currentAcmId: Maybe<string>;
  currentAcm: Maybe<GhostAcm>;
  loadAcms: () => Promise<void>;
  loadAcm: (acmId: string) => Promise<void>;
  disposeAcm: () => void;
}>;

export const useAcmStore = create<AcmStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  acms: [],
  currentAcmId: nothing(),
  currentAcm: nothing(),
  loadAcms: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      const data = await listGhostAcm(serverUrl, ghostDir);
      set({ acms: data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ acms: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadAcm: async (acmId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      const t = await loadGhostAcm({ serverUrl, ghostDir, acmId });
      set({ currentAcmId: acmId, currentAcm: t });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentAcmId: nothing(), currentAcm: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeAcm: () => set({ currentAcmId: nothing(), currentAcm: nothing() }),
}));
