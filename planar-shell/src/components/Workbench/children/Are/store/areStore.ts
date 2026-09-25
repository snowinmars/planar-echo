import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostAre, Maybe } from '@planar/shared';

export type AreStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  ares: string[];
  currentAreId: Maybe<string>;
  currentAre: Maybe<GhostAre>;
  loadAres: () => Promise<void>;
  loadAre: (areId: string) => Promise<void>;
  disposeAre: () => void;
}>;

export const useAreStore = create<AreStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  ares: [],
  currentAreId: nothing(),
  currentAre: nothing(),
  loadAres: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'are' },
        throwOnError: true,
      });
      set({ ares: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ ares: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadAre: async (areId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'are', resourceName: areId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostAre>(skeletonResponse.data.data.content);
      set({
        currentAreId: areId,
        currentAre: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentAreId: nothing(), currentAre: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeAre: () => set({ currentAreId: nothing(), currentAre: nothing() }),
}));
