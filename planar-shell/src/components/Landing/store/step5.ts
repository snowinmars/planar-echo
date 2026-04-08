import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep5 } from './types';
import type { StateCreator } from 'zustand';

export const useLandingStoreStep5: StateCreator<LandingState, [], [], LandingStateStep5> = (set) => {
  const ownGame = planarLocalStorage.get<boolean>('ownGame', false)!;

  return {
    ownGame,
    step5Valid: false,

    setOwnGame: (ownGame: boolean) => {
      set({ ownGame });
      planarLocalStorage.set('ownGame', ownGame);

      set({ step5Valid: ownGame });
    },

    step5Destroy: () => {},
  };
};
