import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostIniAnimation, GhostIniArea, GhostIniResdata, Maybe } from '@planar/shared';

type LoadedGhostIni = GhostIniResdata | GhostIniAnimation | GhostIniArea;

export type IniStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  inis: string[];
  currentIniId: Maybe<string>;
  currentIni: Maybe<LoadedGhostIni>;
  loadInis: () => Promise<void>;
  loadIni: (iniId: string) => Promise<void>;
  disposeIni: () => void;
}>;

export const useIniStore = create<IniStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  inis: [],
  currentIniId: nothing(),
  currentIni: nothing(),
  loadInis: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'ini' },
        throwOnError: true,
      });
      set({ inis: listed.data });
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
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'ini', resourceName: iniId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<LoadedGhostIni>(skeletonResponse.data.data.content);
      set({
        currentIniId: iniId,
        currentIni: skeleton(),
      });
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
