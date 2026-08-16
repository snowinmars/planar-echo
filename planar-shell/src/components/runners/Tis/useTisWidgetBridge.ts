import { useEffect } from 'react';
import { tisWidgetState } from '@/shared/widgets';
import { useTisStore } from './store/tisStore';

import type { TisStore } from './store/tisStore';

const pickWidgetState = (state: TisStore) => ({
  loading: state.loading,
  tiss: state.tiss,
  currentTisId: state.currentTisId,
});

export const useTisWidgetBridge = (): void => {
  useEffect(() => {
    const store = useTisStore.getState();

    tisWidgetState.registerActions({
      loadTiss: store.loadTiss,
      loadTis: store.loadTis,
    });

    const syncFromStore = (state: TisStore) => {
      tisWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useTisStore.subscribe(syncFromStore);

    store.loadTiss().catch(e => console.error(e));

    return () => {
      unsubscribe();
      tisWidgetState.unregisterActions();
      tisWidgetState.reset();
    };
  }, []);
};
