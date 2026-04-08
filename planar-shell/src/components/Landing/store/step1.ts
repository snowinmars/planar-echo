import planarLocalStorage from '@/shared/planarLocalStorage';
import type { GameLanguage, GameName } from '@planar/shared';

import type { LandingState, LandingStateStep1 } from './types';
import type { StateCreator } from 'zustand';

export const useLandingStoreStep1: StateCreator<LandingState, [], [], LandingStateStep1> = (set, get) => {
  const gameLanguage = planarLocalStorage.get<GameLanguage | ''>('gameLanguage', '')!;
  const gameName = planarLocalStorage.get<GameName | ''>('gameName', '')!;

  return {
    gameLanguage,
    gameName,
    step1Valid: !!gameLanguage && !!gameName,

    setGameLanguage: (gameLanguage: GameLanguage | '') => {
      set({ gameLanguage });
      planarLocalStorage.set('gameLanguage', gameLanguage);

      const { gameName } = get();
      const hasGameLanguage = !!gameLanguage;
      const hasGameName = !!gameName;
      set({ step1Valid: hasGameLanguage && hasGameName });
    },

    setGameName: (gameName: GameName | '') => {
      set({ gameName });
      planarLocalStorage.set('gameName', gameName);

      const { gameLanguage } = get();
      const hasGameLanguage = !!gameLanguage;
      const hasGameName = !!gameName;
      set({ step1Valid: hasGameLanguage && hasGameName });
    },

    step1Destroy: () => {

    },
  };
};
