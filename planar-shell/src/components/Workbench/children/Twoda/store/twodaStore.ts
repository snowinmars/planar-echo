import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostTwoda, Maybe } from '@planar/shared';

export type TwodaStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  twodas: string[];
  currentTwodaId: Maybe<string>;
  currentTwoda: Maybe<GhostTwoda>;
  loadTwodas: () => Promise<void>;
  loadTwoda: (twodaId: string) => Promise<void>;
  disposeTwoda: () => void;
}>;

export const useTwodaStore = create<TwodaStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  twodas: [],
  currentTwodaId: nothing(),
  currentTwoda: nothing(),
  loadTwodas: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'twoda' },
        throwOnError: true,
      });
      set({ twodas: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ twodas: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadTwoda: async (twodaId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'twoda', resourceName: twodaId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostTwoda>(skeletonResponse.data.data.content);
      set({
        currentTwodaId: twodaId,
        currentTwoda: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentTwodaId: nothing(), currentTwoda: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeTwoda: () => set({ currentTwodaId: nothing(), currentTwoda: nothing() }),
}));
