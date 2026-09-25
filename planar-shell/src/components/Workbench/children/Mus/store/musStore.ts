import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostMus, Maybe } from '@planar/shared';

export type MusStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  muss: string[];
  currentMusId: Maybe<string>;
  currentMus: Maybe<GhostMus>;
  loadMuss: () => Promise<void>;
  loadMus: (musId: string) => Promise<void>;
  disposeMus: () => void;
}>;

export const useMusStore = create<MusStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  muss: [],
  currentMusId: nothing(),
  currentMus: nothing(),
  loadMuss: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'mus' },
        throwOnError: true,
      });
      set({ muss: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ muss: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadMus: async (musId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'mus', resourceName: musId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostMus>(skeletonResponse.data.data.content);
      set({
        currentMusId: musId,
        currentMus: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentMusId: nothing(), currentMus: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeMus: () => set({ currentMusId: nothing(), currentMus: nothing() }),
}));
