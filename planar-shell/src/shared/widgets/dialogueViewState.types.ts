import type { Maybe, StateId, TranslatedNpcDialogue } from '@planar/shared';

export type DialogueViewState = {
  loading: boolean;
  dialogues: string[];
  tree: Maybe<TranslatedNpcDialogue>;
  currentDialogueId: Maybe<string>;
  currentStateId: Maybe<StateId>;
};

export type DialogueViewActions = {
  loadDialogues: () => Promise<void>;
  setDialogue: (dialogueId: string, targetState?: Maybe<StateId>) => Promise<void>;
  setCurrentStateId: (targetStateId: StateId) => void;
};
