import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostBam, Maybe } from '@planar/shared';

export type BamStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  bams: string[];
  currentBamId: Maybe<string>;
  currentBam: Maybe<GhostBam>;
  loadBams: () => Promise<void>;
  loadBam: (bamId: string) => Promise<void>;
  disposeBam: () => void;
}>;

export const useBamStore = create<BamStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  bams: [],
  currentBamId: nothing(),
  currentBam: nothing(),
  loadBams: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bam' },
        throwOnError: true,
      });
      set({ bams: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ bams: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadBam: async (bamId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'bam', resourceName: bamId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostBam>(skeletonResponse.data.data.content);
      set({
        currentBamId: bamId,
        currentBam: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentBamId: nothing(), currentBam: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeBam: () => set({ currentBamId: nothing(), currentBam: nothing() }),
}));
