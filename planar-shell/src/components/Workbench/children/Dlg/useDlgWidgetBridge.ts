import { useEffect } from 'react';

import { dlgWidgetState } from '@/shared/widgets';

import { useDlgStoreApi } from './store/di';

import type { DlgStore } from './store/dlgStore.types';

const pickWidgetState = (state: DlgStore) => ({
  loading: state.loading > 0,
  dlgs: state.dlgs,
  tree: state.tree,
  currentDlgId: state.currentDlgId,
  currentStateId: state.currentStateId,
});

export const useDlgWidgetBridge = (): void => {
  const dlgStore = useDlgStoreApi();

  useEffect(() => {
    const store = dlgStore.getState();

    dlgWidgetState.registerActions({
      loadDlgsIds: store.loadDlgsIds,
      loadDlg: (dlgId, targetState) => store.loadDlg(dlgId, targetState, 'header'),
      setCurrentStateId: targetStateId => store.setCurrentStateId(targetStateId),
    });

    const syncFromStore = (state: DlgStore) => {
      dlgWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = dlgStore.subscribe(syncFromStore);

    store.loadDlgsIds().catch(e => console.error(e));

    return () => {
      unsubscribe();
      dlgWidgetState.unregisterActions();
      dlgWidgetState.reset();
    };
  }, [dlgStore]);
};
