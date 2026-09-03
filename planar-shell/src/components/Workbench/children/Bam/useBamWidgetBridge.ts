import { useEffect } from 'react';

import { bamWidgetState } from '@/shared/widgets';

import { useBamStore } from './store/bamStore';

import type { BamStore } from './store/bamStore';

const pickWidgetState = (state: BamStore) => ({
  loading: state.loading,
  bams: state.bams,
  currentBamId: state.currentBamId,
});

export const useBamWidgetBridge = (): void => {
  useEffect(() => {
    const store = useBamStore.getState();
    bamWidgetState.registerActions({
      loadBams: store.loadBams,
      loadBam: store.loadBam,
    });
    const syncFromStore = (state: BamStore) => {
      bamWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useBamStore.subscribe(syncFromStore);
    store.loadBams().catch(e => console.error(e));
    return () => {
      unsubscribe();
      bamWidgetState.unregisterActions();
      bamWidgetState.reset();
    };
  }, []);
};
