import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import { listGhostIni, loadGhostIni } from './iniApi';

import type { GhostIni, Maybe } from '@planar/shared';

export type IniStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  loading: boolean;
  inis: string[];
  currentIniId: Maybe<string>;
  currentIni: Maybe<GhostIni>;
  loadInis: () => Promise<void>;
  loadIni: (iniId: string) => Promise<void>;
  disposeIni: () => void;
}>;

export const useIniStore = create<IniStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  loading: false,
  inis: [],
  currentIniId: nothing(),
  currentIni: nothing(),
  loadInis: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ inis: await listGhostIni(serverUrl, ghostDir) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ inis: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadIni: async (iniId: string) => {
    set({ loading: true });
    try {
      const { serverUrl, ghostDir } = get();
      set({ currentIniId: iniId, currentIni: await loadGhostIni({ serverUrl, ghostDir, iniId }) });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentIniId: nothing(), currentIni: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeIni: () => set({ currentIniId: nothing(), currentIni: nothing() }),
}));
