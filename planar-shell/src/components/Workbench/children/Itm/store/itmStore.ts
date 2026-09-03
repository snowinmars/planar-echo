import { create } from 'zustand';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { postApiGhostItm } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { loadGhostItm } from './itmApi';

import type { GhostItm, Maybe } from '@planar/shared';

import type { GameLanguage } from '@/swagger/client';

export type ItmStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
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
  ghostDir: planarLocalStorage.get('ghostDir')!,
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
      const { serverUrl, ghostDir } = get();
      const { error, data } = await postApiGhostItm({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({
          itms: [],
        });
      }
      else {
        set({
          itms: data,
        });
      }
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
      const {
        serverUrl,
        ghostDir,
      } = get();
      const t = await loadGhostItm({
        serverUrl,
        ghostDir,
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
