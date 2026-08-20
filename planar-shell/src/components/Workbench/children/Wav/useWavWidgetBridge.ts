import { useEffect } from 'react';
import { wavWidgetState } from '@/shared/widgets';
import { useWavStore } from './store/wavStore';

import type { WavStore } from './store/wavStore';

const pickWidgetState = (state: WavStore) => ({
  loading: state.loading,
  wavs: state.wavs,
  currentWavId: state.currentWavId,
});

export const useWavWidgetBridge = (): void => {
  useEffect(() => {
    const store = useWavStore.getState();
    wavWidgetState.registerActions({
      loadWavs: store.loadWavs,
      loadWav: store.loadWav,
    });
    const syncFromStore = (state: WavStore) => {
      wavWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useWavStore.subscribe(syncFromStore);
    store.loadWavs().catch(e => console.error(e));
    return () => {
      unsubscribe();
      wavWidgetState.unregisterActions();
      wavWidgetState.reset();
    };
  }, []);
};
