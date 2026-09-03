import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import type { StateCreator } from 'zustand';

import type { LandingState, LandingStateStep0 } from './types';

export const useLandingStoreStep0: StateCreator<LandingState, [], [], LandingStateStep0> = (set) => {
  const serverUrl = planarLocalStorage.get<string>('serverUrl', 'http://localhost:3003')!;

  return {
    serverUrl,
    step0Valid: !!serverUrl,
    step0Loading: false,
    step0Comment: '',
    step0CommentArgs: {},
    step0ResultType: nothing(),

    setServerUrl: (serverUrl: string) => {
      set({ serverUrl });
      planarLocalStorage.set('serverUrl', serverUrl);

      set({ step0Valid: !!serverUrl });
    },

    step0Validate: () => {
      set({ step0Valid: true }); // TODO [snow]: write validation logic

      return Promise.resolve();
    },

    step0Destroy: () => {

    },
  };
};
