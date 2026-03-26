import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep4 } from './types';
import type { StateCreator } from 'zustand';

export const useLandingStoreStep4: StateCreator<LandingState, [], [], LandingStateStep4> = (set) => {
  const ownGame = planarLocalStorage.get<boolean>('ownGame', false)!;

  return {
    ownGame,
    step4Valid: false,

    setOwnGame: (ownGame: boolean) => {
      set({ ownGame });
      planarLocalStorage.set('ownGame', ownGame);

      set({ step4Valid: ownGame });
    },
  };
};
