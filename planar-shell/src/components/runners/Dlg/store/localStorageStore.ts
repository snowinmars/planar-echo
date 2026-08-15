import planarLocalStorage from '@/shared/planarLocalStorage';
import { Subscription } from 'rxjs';

import type { LocalStorageStore } from './localStorageStore.types';
import type { StateCreator } from 'zustand/vanilla';
import type { GameLanguage } from '@planar/shared';

const getValues = () => ({
  serverUrl: planarLocalStorage.get<string>('serverUrl', 'http://localhost:3003')!,
  ghostDir: planarLocalStorage.get<string>('ghostDir'),
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage'),
  dlgRenderer: planarLocalStorage.get<string>('dlgRenderer', 'pstee')!,
  dlgMarks: {
    markDisposers: planarLocalStorage.get<boolean>('dlgMarks_markDisposers', false)!,
    markExterns: planarLocalStorage.get<boolean>('dlgMarks_markExterns', false)!,
  },
  tlkCacheMaxLines: planarLocalStorage.get<number>('tlkCacheMaxLines', 200)!,
});

export const createLocalStorageStore: StateCreator<LocalStorageStore> = (set) => {
  return {
    ...getValues(),
    start: () => {
      set(getValues());

      const masterSubscription = new Subscription();
      masterSubscription.add(
        planarLocalStorage.onKeyChange('serverUrl').subscribe(() => {
          set({ serverUrl: planarLocalStorage.get<string>('serverUrl')! });
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('ghostDir').subscribe(() => {
          set({ ghostDir: planarLocalStorage.get<string>('ghostDir')! });
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('gameLanguage').subscribe(() => {
          set({ gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')! });
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('dlgRenderer').subscribe(() => {
          set({ dlgRenderer: planarLocalStorage.get<string>('dlgRenderer')! });
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('dlgMarks_markDisposers').subscribe(() => {
          set(state => ({
            dlgMarks: {
              ...state.dlgMarks,
              markDisposers: planarLocalStorage.get<boolean>('dlgMarks_markDisposers')!,
            },
          }));
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('dlgMarks_markExterns').subscribe(() => {
          set(state => ({
            dlgMarks: {
              ...state.dlgMarks,
              markExterns: planarLocalStorage.get<boolean>('dlgMarks_markExterns')!,
            },
          }));
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('tlkCacheMaxLines').subscribe(() => {
          set({ tlkCacheMaxLines: planarLocalStorage.get<number>('tlkCacheMaxLines')! });
        }),
      );

      return () => masterSubscription.unsubscribe();
    },
  };
};
