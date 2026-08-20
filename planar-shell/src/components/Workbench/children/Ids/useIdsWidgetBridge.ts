import { useEffect } from 'react';
import { idsWidgetState } from '@/shared/widgets';
import { useIdsStore } from './store/idsStore';

import type { IdsStore } from './store/idsStore';

const pickWidgetState = (state: IdsStore) => ({
  loading: state.loading,
  idss: state.idss,
  currentIdsId: state.currentIdsId,
});

export const useIdsWidgetBridge = (): void => {
  useEffect(() => {
    const store = useIdsStore.getState();
    idsWidgetState.registerActions({
      loadIdss: store.loadIdss,
      loadIds: store.loadIds,
    });
    const syncFromStore = (state: IdsStore) => {
      idsWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useIdsStore.subscribe(syncFromStore);
    store.loadIdss().catch(e => console.error(e));
    return () => {
      unsubscribe();
      idsWidgetState.unregisterActions();
      idsWidgetState.reset();
    };
  }, []);
};
