import type { Maybe, StateId, TranslatedNpcDialogue } from '@planar/shared';

export type DialogueWidgetState = {
  loading: boolean;
  dialogues: string[];
  tree: Maybe<TranslatedNpcDialogue>;
  currentDialogueId: Maybe<string>;
  currentStateId: Maybe<StateId>;
};

export type DialogueWidgetActions = {
  loadDialogues: () => Promise<void>;
  loadDialogue: (dialogueId: string, targetState?: Maybe<StateId>) => Promise<void>;
  setCurrentStateId: (targetStateId: StateId) => void;
};
