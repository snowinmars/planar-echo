import { useEffect } from 'react';
import { iniWidgetState } from '@/shared/widgets';
import { useIniStore } from './store/iniStore';

import type { IniStore } from './store/iniStore';

const pickWidgetState = (state: IniStore) => ({
  loading: state.loading,
  inis: state.inis,
  currentIniId: state.currentIniId,
});

export const useIniWidgetBridge = (): void => {
  useEffect(() => {
    const store = useIniStore.getState();
    iniWidgetState.registerActions({
      loadInis: store.loadInis,
      loadIni: store.loadIni,
    });
    const syncFromStore = (state: IniStore) => {
      iniWidgetState.publish(pickWidgetState(state));
    };
    syncFromStore(store);
    const unsubscribe = useIniStore.subscribe(syncFromStore);
    store.loadInis().catch(e => console.error(e));
    return () => {
      unsubscribe();
      iniWidgetState.unregisterActions();
      iniWidgetState.reset();
    };
  }, []);
};
