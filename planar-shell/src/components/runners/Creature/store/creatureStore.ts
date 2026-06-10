import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostCreature } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { loadTranslatedCreature } from './creatureApi';

import type { Maybe, TranslatedCreature } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

export type CreatureStore = Readonly<{
  serverUrl: string;
  ghostPath: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  creatures: string[];
  currentCreatureId: string;
  translatedCreature: Maybe<TranslatedCreature>;

  loadCreatures: () => Promise<void>;
  loadCreature: (creatureId: string) => Promise<void>;
  disposeCreature: () => void;
}>;

export const useCreatureStore = create<CreatureStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostPath: planarLocalStorage.get('ghostPath')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  creatures: [],
  currentCreatureId: '',
  translatedCreature: nothing(),

  loadCreatures: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl, ghostPath } = get();
      const { error, data } = await postApiGhostCreature({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostPath }, // may use server filter here, but nah
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
        ghostPath,
        gameLanguage,
      } = get();
      const t = await loadTranslatedCreature({
        serverUrl,
        ghostPath,
        gameLanguage,
        creatureId,
      });

      set({
        currentCreatureId: creatureId,
        translatedCreature: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentCreatureId: '',
        translatedCreature: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeCreature: () => set({
    currentCreatureId: '',
    translatedCreature: nothing(),
  }),
}));
