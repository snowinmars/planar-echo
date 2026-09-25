import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostAcm, Maybe } from '@planar/shared';

export type AcmStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  acms: string[];
  currentAcmId: Maybe<string>;
  currentAcm: Maybe<GhostAcm>;
  loadAcms: () => Promise<void>;
  loadAcm: (acmId: string) => Promise<void>;
  disposeAcm: () => void;
}>;

export const useAcmStore = create<AcmStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  acms: [],
  currentAcmId: nothing(),
  currentAcm: nothing(),
  loadAcms: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'acm' },
        throwOnError: true,
      });
      set({ acms: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ acms: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadAcm: async (acmId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'acm', resourceName: acmId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostAcm>(skeletonResponse.data.data.content);
      set({
        currentAcmId: acmId,
        currentAcm: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentAcmId: nothing(), currentAcm: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeAcm: () => set({ currentAcmId: nothing(), currentAcm: nothing() }),
}));
