import { useEffect } from 'react';
import { dialogueWidgetState } from '@/shared/widgets';
import { useDialogueStoreApi } from './store/di';

import type { DialogueStore } from './store/dialogueStore.types';

const pickWidgetState = (state: DialogueStore) => ({
  loading: state.loading,
  dialogues: state.dialogues,
  tree: state.tree,
  currentDialogueId: state.currentDialogueId,
  currentStateId: state.currentStateId,
});

export const useDialogueWidgetBridge = (): void => {
  const dialogueStore = useDialogueStoreApi();

  useEffect(() => {
    const store = dialogueStore.getState();

    dialogueWidgetState.registerActions({
      loadDialoguesIds: store.loadDialoguesIds,
      loadDialogue: (dialogueId, targetState) => store.loadDialogue(dialogueId, targetState, 'header'),
      setCurrentStateId: targetStateId => store.setCurrentStateId(targetStateId),
    });

    const syncFromStore = (state: DialogueStore) => {
      dialogueWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = dialogueStore.subscribe(syncFromStore);

    store.loadDialoguesIds().catch(e => console.error(e));

    return () => {
      unsubscribe();
      dialogueWidgetState.unregisterActions();
      dialogueWidgetState.reset();
    };
  }, [dialogueStore]);
};
