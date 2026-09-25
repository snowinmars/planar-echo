import { create } from 'zustand';

import { evalGhostFactory, nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import {
  getApiGhostByResourceType,
  getApiGhostByResourceTypeByResourceNameSkeleton,
} from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { GhostWav, Maybe } from '@planar/shared';

export type WavStore = Readonly<{
  serverUrl: string;
  loading: boolean;
  wavs: string[];
  currentWavId: Maybe<string>;
  currentWav: Maybe<GhostWav>;
  loadWavs: () => Promise<void>;
  loadWav: (wavId: string) => Promise<void>;
  disposeWav: () => void;
}>;

export const useWavStore = create<WavStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  loading: false,
  wavs: [],
  currentWavId: nothing(),
  currentWav: nothing(),
  loadWavs: async (): Promise<void> => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'wav' },
        throwOnError: true,
      });
      set({ wavs: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
      set({ wavs: [] });
    }
    finally {
      set({ loading: false });
    }
  },
  loadWav: async (wavId: string) => {
    set({ loading: true });
    try {
      const { serverUrl } = get();
      const skeletonResponse = await getApiGhostByResourceTypeByResourceNameSkeleton({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'wav', resourceName: wavId },
        throwOnError: true,
      });
      const skeleton = evalGhostFactory<GhostWav>(skeletonResponse.data.data.content);
      set({
        currentWavId: wavId,
        currentWav: skeleton(),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({ currentWavId: nothing(), currentWav: nothing() });
    }
    finally {
      set({ loading: false });
    }
  },
  disposeWav: () => set({ currentWavId: nothing(), currentWav: nothing() }),
}));
