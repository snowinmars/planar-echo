import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostBcs, Maybe } from '@planar/shared';

export type BcsStore = Readonly<{
  serverUrl: string;
  loading: boolean;

  bcss: string[];
  currentBcsId: Maybe<string>;
  currentBcs: Maybe<GhostBcs>;

  loadBcss: () => Promise<void>;
  loadBcs: (bcsId: string) => Promise<void>;
  disposeBcs: () => void;
}>;

export const useBcsStore = create<BcsStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,

  bcss: [],
  currentBcsId: nothing(),
  currentBcs: nothing(),

  loadBcss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bcs' },
        throwOnError: true,
      });
      set({ bcss: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bcss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadBcs: async (bcsId: string) => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bcs', resourceName: bcsId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostBcs>(skeletonResponse.data.data.content);
      set({
        currentBcsId: bcsId,
        currentBcs: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentBcsId: nothing(),
        currentBcs: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeBcs: () => set({
    currentBcsId: nothing(),
    currentBcs: nothing(),
  }),
}));
