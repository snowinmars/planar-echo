import { useEffect, useSyncExternalStore } from 'react';

import { listenWorldStoreBroadcast } from '@/engine/store/worldBroadcast';
import { getZustandCharacter, getZustandNarrative } from '@/engine/store/worldStores';
import { getDbCharacters, getDbNarrative } from '@/shared/indexedDb';

export const reloadStoresFromDb = async (): Promise<void> => {
  const narrative = getZustandNarrative()!;
  const character = getZustandCharacter()!;

  const savedNarrative = await getDbNarrative();
  const savedCharacters = await getDbCharacters();

  if (savedNarrative) {
    narrative.setState(savedNarrative.state, true);
  }
  if (savedCharacters) {
    character.setState(savedCharacters.state, true);
  }
};

export const useWorldStores = (): void => {
  const narrative = getZustandNarrative()!;
  const character = getZustandCharacter()!;

  useSyncExternalStore(
    narrative.subscribe,
    narrative.getState,
  );
  useSyncExternalStore(
    character.subscribe,
    character.getState,
  );

  useEffect(() => {
    const unsubscribe = listenWorldStoreBroadcast(() => {
      reloadStoresFromDb().catch(console.error);
    });

    return () => unsubscribe();
  }, []);
};
