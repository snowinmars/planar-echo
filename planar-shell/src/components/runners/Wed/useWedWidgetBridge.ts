import { useEffect } from 'react';
import { wedWidgetState } from '@/shared/widgets';
import { useWedStore } from './store/wedStore';

import type { WedStore } from './store/wedStore';

const pickWidgetState = (state: WedStore) => ({
  loading: state.loading,
  weds: state.weds,
  currentWedId: state.currentWedId,
});

export const useWedWidgetBridge = (): void => {
  useEffect(() => {
    const store = useWedStore.getState();

    wedWidgetState.registerActions({
      loadWeds: store.loadWeds,
      loadWed: store.loadWed,
    });

    const syncFromStore = (state: WedStore) => {
      wedWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useWedStore.subscribe(syncFromStore);

    store.loadWeds().catch(e => console.error(e));

    return () => {
      unsubscribe();
      wedWidgetState.unregisterActions();
      wedWidgetState.reset();
    };
  }, []);
};
