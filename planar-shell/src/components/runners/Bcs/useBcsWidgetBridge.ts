import { useEffect } from 'react';
import { bcsWidgetState } from '@/shared/widgets';
import { useBcsStore } from './store/bcsStore';

import type { BcsStore } from './store/bcsStore';

const pickWidgetState = (state: BcsStore) => ({
  loading: state.loading,
  bcss: state.bcss,
  currentBcsId: state.currentBcsId,
});

export const useBcsWidgetBridge = (): void => {
  useEffect(() => {
    const store = useBcsStore.getState();

    bcsWidgetState.registerActions({
      loadBcss: store.loadBcss,
      loadBcs: store.loadBcs,
    });

    const syncFromStore = (state: BcsStore) => {
      bcsWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useBcsStore.subscribe(syncFromStore);

    store.loadBcss().catch(e => console.error(e));

    return () => {
      unsubscribe();
      bcsWidgetState.unregisterActions();
      bcsWidgetState.reset();
    };
  }, []);
};
