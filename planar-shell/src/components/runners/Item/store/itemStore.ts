import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostItem } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { loadTranslatedItem } from './itemApi';

import type { Maybe, TranslatedItem } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

export type ItemStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  items: string[];
  currentItemId: string;
  translatedItem: Maybe<TranslatedItem>;

  loadItems: () => Promise<void>;
  loadItem: (itemId: string) => Promise<void>;
  disposeItem: () => void;
}>;

export const useItemStore = create<ItemStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  items: [],
  currentItemId: '',
  translatedItem: nothing(),

  loadItems: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl, ghostDir } = get();
      const { error, data } = await postApiGhostItem({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({
          items: [],
        });
      }
      else {
        set({
          items: data,
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

  loadItem: async (itemId: string) => {
    set({
      loading: true,
    });

    try {
      const {
        serverUrl,
        ghostDir,
        gameLanguage,
      } = get();
      const t = await loadTranslatedItem({
        serverUrl,
        ghostDir,
        gameLanguage,
        itemId,
      });

      set({
        currentItemId: itemId,
        translatedItem: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentItemId: '',
        translatedItem: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeItem: () => set({
    currentItemId: '',
    translatedItem: nothing(),
  }),
}));
