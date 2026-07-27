import type { Maybe, StateId, NpcDialogue } from '@planar/shared';

export type DialogueWidgetState = Readonly<{
  loading: boolean;
  dialogues: string[];
  tree: Maybe<NpcDialogue>;
  currentDialogueId: Maybe<string>;
  currentStateId: Maybe<StateId>;
}>;

export type DialogueWidgetActions = Readonly<{
  loadDialoguesIds: () => Promise<void>;
  loadDialogue: (dialogueId: string, targetState: Maybe<StateId>) => Promise<void>;
  setCurrentStateId: (targetStateId: StateId) => void;
}>;
