import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { getApiGhostByResourceType } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { loadGhostCre } from './creApi';

import type {
  GameLanguage,
  GhostCreV10,
  GhostCreV11,
  Maybe,
} from '@planar/shared';

type GhostCre = GhostCreV10 | GhostCreV11;
export type CreStore = Readonly<{
  serverUrl: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  cres: string[];
  currentCreId: Maybe<string>;
  currentCre: Maybe<GhostCre>;

  loadCres: () => Promise<void>;
  loadCre: (creId: string) => Promise<void>;
  disposeCre: () => void;
}>;

export const useCreStore = create<CreStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  cres: [],
  currentCreId: nothing(),
  currentCre: nothing(),

  loadCres: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'cre' },
        throwOnError: true,
      });

      set({ cres: listed.data });
    }
    catch (e: unknown) {
      console.error(e);
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  loadCre: async (creId: string) => {
    set({
      loading: true,
    });

    try {
      const { serverUrl } = get();
      const t = await loadGhostCre({
        serverUrl,
        creId: creId,
      });

      set({
        currentCreId: creId,
        currentCre: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentCreId: nothing(),
        currentCre: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeCre: () => set({
    currentCreId: nothing(),
    currentCre: nothing(),
  }),
}));
