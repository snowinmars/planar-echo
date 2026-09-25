import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostSrc, Maybe } from '@planar/shared';

export type SrcStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  srcs: string[];
  currentSrcId: Maybe<string>;
  currentSrc: Maybe<GhostSrc>;
  loadSrcs: () => Promise<void>;
  loadSrc: (srcId: string) => Promise<void>;
  disposeSrc: () => void;
}>;

export const useSrcStore = create<SrcStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  srcs: [],
  currentSrcId: nothing(),
  currentSrc: nothing(),
  loadSrcs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'src' },
        throwOnError: true,
      });
      set({ srcs: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ srcs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadSrc: async (srcId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'src', resourceName: srcId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostSrc>(skeletonResponse.data.data.content);
      set({
        currentSrcId: srcId,
        currentSrc: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentSrcId: nothing(), currentSrc: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeSrc: () => set({ currentSrcId: nothing(), currentSrc: nothing() }),
}));
