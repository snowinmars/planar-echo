import { useSyncExternalStore, useEffect } from 'react';
import { getDbNarrative, getDbCharacters } from '@/shared/indexedDb';
import { getZustandNarrative, getZustandCharacter } from '@/engine/store/worldStores';
import { listenWorldStoreBroadcast } from '@/engine/store/worldBroadcast';

export const reloadStoresFromDb = async (): Promise<void> => {
  const narrative = getZustandNarrative();
  const character = getZustandCharacter();
  if (!narrative || !character) return;

  const savedNarrative = await getDbNarrative();
  const savedCharacters = await getDbCharacters();

  if (savedNarrative) {
    narrative.setState(savedNarrative.state, true);
  }
  if (savedCharacters) {
    character.setState(savedCharacters.state, true);
  }
};

const noopSubscribe = () => () => {};
const noopGetSnapshot = () => null;

export const useWorldStores = (): void => {
  const narrative = getZustandNarrative();
  const character = getZustandCharacter();

  useSyncExternalStore(
    narrative?.subscribe ?? noopSubscribe,
    narrative ? () => narrative.getState() : noopGetSnapshot,
  );
  useSyncExternalStore(
    character?.subscribe ?? noopSubscribe,
    character ? () => character.getState() : noopGetSnapshot,
  );

  useEffect(() => {
    const unsubscribe = listenWorldStoreBroadcast(() => {
      reloadStoresFromDb().catch(console.error);
    });

    return () => unsubscribe();
  }, []);
};
