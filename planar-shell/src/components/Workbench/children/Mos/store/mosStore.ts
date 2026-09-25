import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostMos, Maybe } from '@planar/shared';

export type MosStore = Readonly<{
  serverUrl: string;
  loading: boolean;

  moss: string[];
  currentMosId: Maybe<string>;
  currentMos: Maybe<GhostMos>;

  loadMoss: () => Promise<void>;
  loadMos: (mosId: string) => Promise<void>;
  disposeMos: () => void;
}>;

export const useMosStore = create<MosStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,

  moss: [],
  currentMosId: nothing(),
  currentMos: nothing(),

  loadMoss: async (): Promise<void> => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'mos' },
        throwOnError: true,
      });
      set({ moss: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ moss: [] });
    }
    finally {
      set({ loading: false });
    }
  },

  loadMos: async (mosId: string) => {
    set({ loading: true });

    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'mos', resourceName: mosId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostMos>(skeletonResponse.data.data.content);
      set({
        currentMosId: mosId,
        currentMos: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentMosId: nothing(),
        currentMos: nothing(),
      });
    }
    finally {
      set({ loading: false });
    }
  },

  disposeMos: () => set({
    currentMosId: nothing(),
    currentMos: nothing(),
  }),
}));
