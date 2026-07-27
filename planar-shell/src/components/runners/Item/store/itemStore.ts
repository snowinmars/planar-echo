import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostItem } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { loadUntranslatedItem } from './itemApi';

import type { Maybe, UntranslatedItem } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

export type ItemStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  items: string[];
  currentItemId: Maybe<string>;
  currentItem: Maybe<UntranslatedItem>;

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
  currentItemId: nothing(),
  currentItem: nothing(),

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
      } = get();
      const t = await loadUntranslatedItem({
        serverUrl,
        ghostDir,
        itemId,
      });

      set({
        currentItemId: itemId,
        currentItem: t,
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentItemId: nothing(),
        currentItem: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeItem: () => set({
    currentItemId: nothing(),
    currentItem: nothing(),
  }),
}));
