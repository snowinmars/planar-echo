import { useEffect } from 'react';
import { creatureWidgetState } from '@/shared/widgets';
import { useCreatureStore } from './store/creatureStore';

import type { CreatureStore } from './store/creatureStore';

const pickWidgetState = (state: CreatureStore) => ({
  loading: state.loading,
  creatures: state.creatures,
  currentCreatureId: state.currentCreatureId,
  translatedCreature: state.translatedCreature,
});

export const useCreatureWidgetBridge = (): void => {
  useEffect(() => {
    const store = useCreatureStore.getState();

    creatureWidgetState.registerActions({
      loadCreatures: store.loadCreatures,
      loadCreature: store.loadCreature,
    });

    const syncFromStore = (state: CreatureStore) => {
      creatureWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useCreatureStore.subscribe(syncFromStore);

    store.loadCreatures().catch(e => console.error(e));

    return () => {
      unsubscribe();
      creatureWidgetState.unregisterActions();
      creatureWidgetState.reset();
    };
  }, []);
};
