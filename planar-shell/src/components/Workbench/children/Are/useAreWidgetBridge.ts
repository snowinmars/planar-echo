import { useEffect } from 'react';
import { areWidgetState } from '@/shared/widgets';
import { useAreStore } from './store/areStore';

import type { AreStore } from './store/areStore';

const pickWidgetState = (state: AreStore) => ({
  loading: state.loading,
  ares: state.ares,
  currentAreId: state.currentAreId,
});

export const useAreWidgetBridge = (): void => {
  useEffect(() => {
    const store = useAreStore.getState();
    areWidgetState.registerActions({
      loadAres: store.loadAres,
      loadAre: store.loadAre,
    });
    const syncFromStore = (state: AreStore) => {
      areWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useAreStore.subscribe(syncFromStore);
    store.loadAres().catch(e => console.error(e));
    return () => {
      unsubscribe();
      areWidgetState.unregisterActions();
      areWidgetState.reset();
    };
  }, []);
};
