import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { getApiGhostByResourceType } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { loadGhostItm } from './itmApi';

import type { GameLanguage, GhostItm, Maybe } from '@planar/shared';

export type ItmStore = Readonly<{
  serverUrl: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  itms: string[];
  currentItmId: Maybe<string>;
  currentItm: Maybe<GhostItm>;

  loadItms: () => Promise<void>;
  loadItm: (itmId: string) => Promise<void>;
  disposeItm: () => void;
}>;

export const useItmStore = create<ItmStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  itms: [],
  currentItmId: nothing(),
  currentItm: nothing(),

  loadItms: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl } = get();
      const listed = await getApiGhostByResourceType({
        client,
        baseURL: serverUrl,
        path: { resourceType: 'itm' },
        throwOnError: true,
      });
      set({ itms: listed.data });
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

  loadItm: async (itmId: string) => {
    set({
      loading: true,
    });

    try {
      const { serverUrl } = get();
      const t = await loadGhostItm({
        serverUrl,
        itmId: itmId,
      });

      set({
        currentItmId: itmId,
        currentItm: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentItmId: nothing(),
        currentItm: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeItm: () => set({
    currentItmId: nothing(),
    currentItm: nothing(),
  }),
}));
