import { useEffect } from 'react';
import { itemWidgetState } from '@/shared/widgets';
import { useItemStore } from './store/itemStore';

import type { ItemStore } from './store/itemStore';

const pickWidgetState = (state: ItemStore) => ({
  loading: state.loading,
  items: state.items,
  currentItemId: state.currentItemId,
  translatedItem: state.translatedItem,
});

export const useItemWidgetBridge = (): void => {
  useEffect(() => {
    const store = useItemStore.getState();

    itemWidgetState.registerActions({
      loadItems: store.loadItems,
      loadItem: store.loadItem,
    });

    const syncFromStore = (state: ItemStore) => {
      itemWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useItemStore.subscribe(syncFromStore);

    store.loadItems().catch(e => console.error(e));

    return () => {
      unsubscribe();
      itemWidgetState.unregisterActions();
      itemWidgetState.reset();
    };
  }, []);
};
