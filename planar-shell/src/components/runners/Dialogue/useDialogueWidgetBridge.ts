import { useEffect } from 'react';
import { dialogueWidgetState } from '@/shared/widgets';
import { useDialogueStore } from './store/dialogueStore';

import type { DialogueStore } from './store/dialogueStore';

const pickWidgetState = (state: DialogueStore) => ({
  loading: state.loading,
  dialogues: state.dialogues,
  tree: state.tree,
  currentDialogueId: state.currentDialogueId,
  currentStateId: state.currentStateId,
});

export const useDialogueWidgetBridge = (): void => {
  useEffect(() => {
    const store = useDialogueStore.getState();

    dialogueWidgetState.registerActions({
      loadDialogues: store.loadDialogues,
      loadDialogue: store.loadDialogue,
      setCurrentStateId: store.setCurrentStateId,
    });

    const syncFromStore = (state: DialogueStore) => {
      dialogueWidgetState.publish(pickWidgetState(state));
    };

    syncFromStore(store);
    const unsubscribe = useDialogueStore.subscribe(syncFromStore);

    store.loadDialogues().catch(e => console.error(e));

    return () => {
      unsubscribe();
      dialogueWidgetState.unregisterActions();
      dialogueWidgetState.reset();
    };
  }, []);
};
