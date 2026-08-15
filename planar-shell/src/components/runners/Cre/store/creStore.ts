import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostCre } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { loadGhostCre } from './creApi';

import type {
  Maybe,
  GhostCreV10,
  GhostCreV11,
} from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

type GhostCre = GhostCreV10 | GhostCreV11;
export type CreStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
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
  ghostDir: planarLocalStorage.get('ghostDir')!,
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
      const { serverUrl, ghostDir } = get();
      const { error, data } = await postApiGhostCre({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({
          cres: [],
        });
      }
      else {
        set({
          cres: data,
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

  loadCre: async (creId: string) => {
    set({
      loading: true,
    });

    try {
      const {
        serverUrl,
        ghostDir,
      } = get();
      const t = await loadGhostCre({
        serverUrl,
        ghostDir,
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
