import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostBmp, Maybe } from '@planar/shared';

export type BmpStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  bmps: string[];
  currentBmpId: Maybe<string>;
  currentBmp: Maybe<GhostBmp>;
  loadBmps: () => Promise<void>;
  loadBmp: (bmpId: string) => Promise<void>;
  disposeBmp: () => void;
}>;

export const useBmpStore = create<BmpStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  bmps: [],
  currentBmpId: nothing(),
  currentBmp: nothing(),
  loadBmps: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bmp' },
        throwOnError: true,
      });
      set({ bmps: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bmps: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadBmp: async (bmpId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bmp', resourceName: bmpId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostBmp>(skeletonResponse.data.data.content);
      set({
        currentBmpId: bmpId,
        currentBmp: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentBmpId: nothing(), currentBmp: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeBmp: () => set({ currentBmpId: nothing(), currentBmp: nothing() }),
}));
