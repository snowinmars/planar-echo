import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostPvr, Maybe } from '@planar/shared';

export type PvrzStore = Readonly<{
  serverUrl: string;
  loading: boolean;

  pvrzs: string[];
  currentPvrzId: Maybe<string>;
  currentPvrz: Maybe<GhostPvr>;

  loadPvrzs: () => Promise<void>;
  loadPvrz: (pvrzId: string) => Promise<void>;
  disposePvrz: () => void;
}>;

export const usePvrzStore = create<PvrzStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,

  pvrzs: [],
  currentPvrzId: nothing(),
  currentPvrz: nothing(),

  loadPvrzs: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'pvrz' },
        throwOnError: true,
      });
      set({ pvrzs: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ pvrzs: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadPvrz: async (pvrzId: string) => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'pvrz', resourceName: pvrzId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostPvr>(skeletonResponse.data.data.content);
      set({
        currentPvrzId: pvrzId,
        currentPvrz: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentPvrzId: nothing(),
        currentPvrz: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposePvrz: () => set({
    currentPvrzId: nothing(),
    currentPvrz: nothing(),
  }),
}));
