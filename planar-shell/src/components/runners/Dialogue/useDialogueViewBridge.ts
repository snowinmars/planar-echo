import { useEffect } from 'react';
import { dialogueViewState } from '@/shared/widgets/dialogueViewState';
import { useDialogueStore } from './store/dialogueStore';

import type { DialogueStore } from './store/dialogueStore';

const pickViewState = (state: DialogueStore) => ({
  loading: state.loading,
  dialogues: state.dialogues,
  tree: state.tree,
  currentDialogueId: state.currentDialogueId,
  currentStateId: state.currentStateId,
});

export const useDialogueViewBridge = (): void => {
  useEffect(() => {
    const store = useDialogueStore.getState();

    dialogueViewState.registerActions({
      loadDialogues: store.loadDialogues,
      setDialogue: store.setDialogue,
      setCurrentStateId: store.setCurrentStateId,
    });

    const syncFromStore = (state: DialogueStore) => {
      dialogueViewState.publish(pickViewState(state));
    };

    syncFromStore(store);
    const unsub = useDialogueStore.subscribe(syncFromStore);

    store.loadDialogues().catch(e => console.error(e));

    return () => {
      unsub();
      dialogueViewState.unregisterActions();
      dialogueViewState.reset();
    };
  }, []);
};
