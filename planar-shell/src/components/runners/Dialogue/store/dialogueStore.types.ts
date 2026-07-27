import type {
  DialogueResponse,
  Maybe,
  NpcDialogue,
  StateId,
} from '@planar/shared';

export type DialogueStore = Readonly<{
  loading: boolean;

  dialogues: string[];
  tree: Maybe<NpcDialogue>;

  currentDialogueId: Maybe<string>;
  setCurrentDialogueId: (dialogueId: string) => void;

  currentStateId: Maybe<StateId>;
  setCurrentStateId: (targetStateId: StateId) => void;
  selectResponse: (response: DialogueResponse, source: string) => Promise<void>;

  loadDialoguesIds: () => Promise<void>;
  loadDialogue: (dialogueId: string, targetStateId: Maybe<StateId>, source: string) => Promise<void>;
  disposeDialogue: (source: string) => Promise<void>;
}>;
