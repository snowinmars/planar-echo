import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostEff, Maybe } from '@planar/shared';

export type EffStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  effs: string[];
  currentEffId: Maybe<string>;
  currentEff: Maybe<GhostEff>;
  loadEffs: () => Promise<void>;
  loadEff: (effId: string) => Promise<void>;
  disposeEff: () => void;
}>;

export const useEffStore = create<EffStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  effs: [],
  currentEffId: nothing(),
  currentEff: nothing(),
  loadEffs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'eff' },
        throwOnError: true,
      });
      set({ effs: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ effs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadEff: async (effId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'eff', resourceName: effId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostEff>(skeletonResponse.data.data.content);
      set({
        currentEffId: effId,
        currentEff: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentEffId: nothing(), currentEff: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeEff: () => set({ currentEffId: nothing(), currentEff: nothing() }),
}));
