import { useEffect } from 'react';
import { creWidgetState } from '@/shared/widgets';
import { useCreStore } from './store/creStore';

import type { CreStore } from './store/creStore';

const pickWidgetState = (state: CreStore) => ({
  loading: state.loading,
  cres: state.cres,
  currentCreId: state.currentCreId,
});

export const useCreWidgetBridge = (): void => {
  useEffect(() => {
    const store = useCreStore.getState();

    creWidgetState.registerActions({
      loadCres: store.loadCres,
      loadCre: store.loadCre,
    });

    const syncFromStore = (state: CreStore) => {
      creWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useCreStore.subscribe(syncFromStore);

    store.loadCres().catch(e => console.error(e));

    return () => {
      unsubscribe();
      creWidgetState.unregisterActions();
      creWidgetState.reset();
    };
  }, []);
};
