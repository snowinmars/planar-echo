import { useEffect } from 'react';

import { srcWidgetState } from '@/shared/widgets';

import { useSrcStore } from './store/srcStore';

import type { SrcStore } from './store/srcStore';

const pickWidgetState = (state: SrcStore) => ({
  loading: state.loading,
  srcs: state.srcs,
  currentSrcId: state.currentSrcId,
});

export const useSrcWidgetBridge = (): void => {
  useEffect(() => {
    const store = useSrcStore.getState();
    srcWidgetState.registerActions({
      loadSrcs: store.loadSrcs,
      loadSrc: store.loadSrc,
    });
    const syncFromStore = (state: SrcStore) => {
      srcWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useSrcStore.subscribe(syncFromStore);
    store.loadSrcs().catch(e => console.error(e));
    return () => {
      unsubscribe();
      srcWidgetState.unregisterActions();
      srcWidgetState.reset();
    };
  }, []);
};
