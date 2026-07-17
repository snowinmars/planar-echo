import type { Maybe, StateId, TranslatedNpcDialogue } from '@planar/shared';

export type DialogueWidgetState = Readonly<{
  loading: boolean;
  dialogues: string[];
  tree: Maybe<TranslatedNpcDialogue>;
  currentDialogueId: Maybe<string>;
  currentStateId: Maybe<StateId>;
}>;

export type DialogueWidgetActions = Readonly<{
  loadDialogues: () => Promise<void>;
  loadDialogue: (dialogueId: string, targetState?: Maybe<StateId>) => Promise<void>;
  setCurrentStateId: (targetStateId: StateId) => void;
}>;
