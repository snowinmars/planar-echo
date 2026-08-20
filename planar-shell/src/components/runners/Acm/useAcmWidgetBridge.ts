import { useEffect } from 'react';
import { acmWidgetState } from '@/shared/widgets';
import { useAcmStore } from './store/acmStore';

import type { AcmStore } from './store/acmStore';

const pickWidgetState = (state: AcmStore) => ({
  loading: state.loading,
  acms: state.acms,
  currentAcmId: state.currentAcmId,
});

export const useAcmWidgetBridge = (): void => {
  useEffect(() => {
    const store = useAcmStore.getState();
    acmWidgetState.registerActions({
      loadAcms: store.loadAcms,
      loadAcm: store.loadAcm,
    });
    const syncFromStore = (state: AcmStore) => {
      acmWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useAcmStore.subscribe(syncFromStore);
    store.loadAcms().catch(e => console.error(e));
    return () => {
      unsubscribe();
      acmWidgetState.unregisterActions();
      acmWidgetState.reset();
    };
  }, []);
};
