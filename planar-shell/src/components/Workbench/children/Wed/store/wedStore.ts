import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostWed, Maybe } from '@planar/shared';

export type WedStore = Readonly<{
  serverUrl: string;
  loading: boolean;

  weds: string[];
  currentWedId: Maybe<string>;
  currentWed: Maybe<GhostWed>;

  loadWeds: () => Promise<void>;
  loadWed: (wedId: string) => Promise<void>;
  disposeWed: () => void;
}>;

export const useWedStore = create<WedStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,

  weds: [],
  currentWedId: nothing(),
  currentWed: nothing(),

  loadWeds: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'wed' },
        throwOnError: true,
      });
      set({ weds: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ weds: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadWed: async (wedId: string) => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'wed', resourceName: wedId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostWed>(skeletonResponse.data.data.content);
      set({
        currentWedId: wedId,
        currentWed: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentWedId: nothing(),
        currentWed: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeWed: () => set({
    currentWedId: nothing(),
    currentWed: nothing(),
  }),
}));
