import { useEffect } from 'react';

import { pvrzWidgetState } from '@/shared/widgets';

import { usePvrzStore } from './store/pvrzStore';

import type { PvrzStore } from './store/pvrzStore';

const pickWidgetState = (state: PvrzStore) => ({
  loading: state.loading,
  pvrzs: state.pvrzs,
  currentPvrzId: state.currentPvrzId,
});

export const usePvrzWidgetBridge = (): void => {
  useEffect(() => {
    const store = usePvrzStore.getState();

    pvrzWidgetState.registerActions({
      loadPvrzs: store.loadPvrzs,
      loadPvrz: store.loadPvrz,
    });

    const syncFromStore = (state: PvrzStore) => {
      pvrzWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = usePvrzStore.subscribe(syncFromStore);

    store.loadPvrzs().catch(e => console.error(e));

    return () => {
      unsubscribe();
      pvrzWidgetState.unregisterActions();
      pvrzWidgetState.reset();
    };
  }, []);
};
