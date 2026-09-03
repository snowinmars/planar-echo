import { useEffect } from 'react';

import { itmWidgetState } from '@/shared/widgets';

import { useItmStore } from './store/itmStore';

import type { ItmStore } from './store/itmStore';

const pickWidgetState = (state: ItmStore) => ({
  loading: state.loading,
  itms: state.itms,
  currentItmId: state.currentItmId,
});

export const useItmWidgetBridge = (): void => {
  useEffect(() => {
    const store = useItmStore.getState();

    itmWidgetState.registerActions({
      loadItms: store.loadItms,
      loadItm: store.loadItm,
    });

    const syncFromStore = (state: ItmStore) => {
      itmWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useItmStore.subscribe(syncFromStore);

    store.loadItms().catch(e => console.error(e));

    return () => {
      unsubscribe();
      itmWidgetState.unregisterActions();
      itmWidgetState.reset();
    };
  }, []);
};
