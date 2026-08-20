import { useEffect } from 'react';
import { bmpWidgetState } from '@/shared/widgets';
import { useBmpStore } from './store/bmpStore';

import type { BmpStore } from './store/bmpStore';

const pickWidgetState = (state: BmpStore) => ({
  loading: state.loading,
  bmps: state.bmps,
  currentBmpId: state.currentBmpId,
});

export const useBmpWidgetBridge = (): void => {
  useEffect(() => {
    const store = useBmpStore.getState();
    bmpWidgetState.registerActions({
      loadBmps: store.loadBmps,
      loadBmp: store.loadBmp,
    });
    const syncFromStore = (state: BmpStore) => {
      bmpWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useBmpStore.subscribe(syncFromStore);
    store.loadBmps().catch(e => console.error(e));
    return () => {
      unsubscribe();
      bmpWidgetState.unregisterActions();
      bmpWidgetState.reset();
    };
  }, []);
};
