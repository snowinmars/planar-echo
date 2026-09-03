import { useEffect } from 'react';

import { musWidgetState } from '@/shared/widgets';

import { useMusStore } from './store/musStore';

import type { MusStore } from './store/musStore';

const pickWidgetState = (state: MusStore) => ({
  loading: state.loading,
  muss: state.muss,
  currentMusId: state.currentMusId,
});

export const useMusWidgetBridge = (): void => {
  useEffect(() => {
    const store = useMusStore.getState();
    musWidgetState.registerActions({
      loadMuss: store.loadMuss,
      loadMus: store.loadMus,
    });
    const syncFromStore = (state: MusStore) => {
      musWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useMusStore.subscribe(syncFromStore);
    store.loadMuss().catch(e => console.error(e));
    return () => {
      unsubscribe();
      musWidgetState.unregisterActions();
      musWidgetState.reset();
    };
  }, []);
};
