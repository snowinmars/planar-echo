import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostIds, Maybe } from '@planar/shared';

export type IdsStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  idss: string[];
  currentIdsId: Maybe<string>;
  currentIds: Maybe<GhostIds>;
  loadIdss: () => Promise<void>;
  loadIds: (idsId: string) => Promise<void>;
  disposeIds: () => void;
}>;

export const useIdsStore = create<IdsStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  idss: [],
  currentIdsId: nothing(),
  currentIds: nothing(),
  loadIdss: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'ids' },
        throwOnError: true,
      });
      set({ idss: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ idss: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadIds: async (idsId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'ids', resourceName: idsId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostIds>(skeletonResponse.data.data.content);
      set({
        currentIdsId: idsId,
        currentIds: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentIdsId: nothing(), currentIds: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeIds: () => set({ currentIdsId: nothing(), currentIds: nothing() }),
}));
