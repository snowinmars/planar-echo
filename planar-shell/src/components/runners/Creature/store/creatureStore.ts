import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostCreature } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { loadUntranslatedCreature } from './creatureApi';

import type {
  Maybe,
  UntranslatedCreatureV10,
  UntranslatedCreatureV11,
} from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

type UntranslatedCreature = UntranslatedCreatureV10 | UntranslatedCreatureV11;
export type CreatureStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  creatures: string[];
  currentCreatureId: Maybe<string>;
  currentCreature: Maybe<UntranslatedCreature>;

  loadCreatures: () => Promise<void>;
  loadCreature: (creatureId: string) => Promise<void>;
  disposeCreature: () => void;
}>;

export const useCreatureStore = create<CreatureStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  creatures: [],
  currentCreatureId: nothing(),
  currentCreature: nothing(),

  loadCreatures: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl, ghostDir } = get();
      const { error, data } = await postApiGhostCreature({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({
          creatures: [],
        });
      }
      else {
        set({
          creatures: data,
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

  loadCreature: async (creatureId: string) => {
    set({
      loading: true,
    });

    try {
      const {
        serverUrl,
        ghostDir,
      } = get();
      const t = await loadUntranslatedCreature({
        serverUrl,
        ghostDir,
        creatureId,
      });

      set({
        currentCreatureId: creatureId,
        currentCreature: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentCreatureId: nothing(),
        currentCreature: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeCreature: () => set({
    currentCreatureId: nothing(),
    currentCreature: nothing(),
  }),
}));
