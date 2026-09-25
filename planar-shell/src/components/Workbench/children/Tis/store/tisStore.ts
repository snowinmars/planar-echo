import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostTis, Maybe } from '@planar/shared';

export type TisStore = Readonly<{
  serverUrl: string;
  loading: boolean;

  tiss: string[];
  currentTisId: Maybe<string>;
  currentTis: Maybe<GhostTis>;

  loadTiss: () => Promise<void>;
  loadTis: (tisId: string) => Promise<void>;
  disposeTis: () => void;
}>;

export const useTisStore = create<TisStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,

  tiss: [],
  currentTisId: nothing(),
  currentTis: nothing(),

  loadTiss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'tis' },
        throwOnError: true,
      });
      set({ tiss: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ tiss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadTis: async (tisId: string) => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'tis', resourceName: tisId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostTis>(skeletonResponse.data.data.content);
      set({
        currentTisId: tisId,
        currentTis: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentTisId: nothing(),
        currentTis: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeTis: () => set({
    currentTisId: nothing(),
    currentTis: nothing(),
  }),
}));
