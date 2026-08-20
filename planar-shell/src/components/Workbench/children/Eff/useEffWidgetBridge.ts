import { useEffect } from 'react';
import { effWidgetState } from '@/shared/widgets';
import { useEffStore } from './store/effStore';

import type { EffStore } from './store/effStore';

const pickWidgetState = (state: EffStore) => ({
  loading: state.loading,
  effs: state.effs,
  currentEffId: state.currentEffId,
});

export const useEffWidgetBridge = (): void => {
  useEffect(() => {
    const store = useEffStore.getState();
    effWidgetState.registerActions({
      loadEffs: store.loadEffs,
      loadEff: store.loadEff,
    });
    const syncFromStore = (state: EffStore) => {
      effWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useEffStore.subscribe(syncFromStore);
    store.loadEffs().catch(e => console.error(e));
    return () => {
      unsubscribe();
      effWidgetState.unregisterActions();
      effWidgetState.reset();
    };
  }, []);
};
