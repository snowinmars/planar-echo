import { useEffect } from 'react';
import { twodaWidgetState } from '@/shared/widgets';
import { useTwodaStore } from './store/twodaStore';

import type { TwodaStore } from './store/twodaStore';

const pickWidgetState = (state: TwodaStore) => ({
  loading: state.loading,
  twodas: state.twodas,
  currentTwodaId: state.currentTwodaId,
});

export const useTwodaWidgetBridge = (): void => {
  useEffect(() => {
    const store = useTwodaStore.getState();
    twodaWidgetState.registerActions({
      loadTwodas: store.loadTwodas,
      loadTwoda: store.loadTwoda,
    });
    const syncFromStore = (state: TwodaStore) => {
      twodaWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useTwodaStore.subscribe(syncFromStore);
    store.loadTwodas().catch(e => console.error(e));
    return () => {
      unsubscribe();
      twodaWidgetState.unregisterActions();
      twodaWidgetState.reset();
    };
  }, []);
};
