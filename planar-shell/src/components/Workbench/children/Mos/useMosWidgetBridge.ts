import { useEffect } from 'react';

import { mosWidgetState } from '@/shared/widgets';

import { useMosStore } from './store/mosStore';

import type { MosStore } from './store/mosStore';

const pickWidgetState = (state: MosStore) => ({
  loading: state.loading,
  moss: state.moss,
  currentMosId: state.currentMosId,
});

export const useMosWidgetBridge = (): void => {
  useEffect(() => {
    const store = useMosStore.getState();

    mosWidgetState.registerActions({
      loadMoss: store.loadMoss,
      loadMos: store.loadMos,
    });

    const syncFromStore = (state: MosStore) => {
      mosWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useMosStore.subscribe(syncFromStore);

    store.loadMoss().catch(e => console.error(e));

    return () => {
      unsubscribe();
      mosWidgetState.unregisterActions();
      mosWidgetState.reset();
    };
  }, []);
};
