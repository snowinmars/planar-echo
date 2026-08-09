import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostDialogue } from '@/swagger/client';
import {
  chooseStartingStateId,
  getExternDialogueId,
  isDestructor,
} from './helpers';
import { dialogueRepository } from './dialogueRepository';
import { getZustandNarrative, getZustandCharacter } from '@/engine/store/worldStores';
import { planarStoreId } from '@/engine/store/planarRuntime.types';

import type { DialogueResponse, DialogueSay, Maybe, NpcDialogue, StateId } from '@planar/shared';
import type { GameHistoryEvent } from '@/shared/indexedDb';
import type { DialogueStore } from './dialogueStore.types';
import type { StateCreator } from 'zustand/vanilla';
import type { PlanarRuntime } from '@/engine/store/planarRuntime.types';
import type { GameHistoryStore } from './gameHistoryStore.types';
import type { LocalStorageStore } from './localStorageStore.types';

const createDialogueHistoryEvents = (
  says: DialogueSay[],
  response: Maybe<DialogueResponse>,
  source: string,
): GameHistoryEvent[] => {
  return [
    ...says.map((say): GameHistoryEvent => ({
      kind: 'say',
      tlkRef: say.textRef,
      whoId: say.whoId,
      source,
    })),
    ...(response
      ? [{
          kind: 'response' as const,
          tlkRef: response.responseRef ?? null,
          whoId: 'nameless' as const,
          source,
        }]
      : []),
  ];
};

export const createDialogueStore = (runtime: PlanarRuntime): StateCreator<DialogueStore> => (set, get) => {
  const loadDialogueTree = async (dialogueId: string, initialStateId: Maybe<StateId>): Promise<void> => {
    const {
      serverUrl,
      ghostDir,
    } = runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).getState();

    const narrative = getZustandNarrative();
    const character = getZustandCharacter();

    if (!narrative || !character) throw new Error('World stores were not initialized');
    if (!ghostDir) throw new Error('Ghost directory should be initialized here');

    set({ loading: true });
    const tree = await dialogueRepository.loadDialogueTree({
      serverUrl,
      ghostDir,
      dialogueId,
      narrative,
      character,
    }).finally(() => set({ loading: false }));

    set({
      tree,
      currentDialogueId: dialogueId,
      currentStateId: initialStateId ?? chooseStartingStateId(tree),
    });
  };

  const runTransition = async (transition: () => Promise<void>): Promise<void> => {
    if (get().loading) return;

    set({ loading: true });
    await transition().finally(() => set({ loading: false }));
  };

  const appendStateToHistory = async (
    tree: Maybe<NpcDialogue>,
    currentStateId: Maybe<StateId>,
    response: Maybe<DialogueResponse>,
    source: string,
  ): Promise<void> => {
    if (!tree || !currentStateId) return;
    const { says } = tree.tree.get(currentStateId)!;
    const events = createDialogueHistoryEvents(says, response, source);
    await runtime.getStore<GameHistoryStore>(planarStoreId.gameHistory).getState().append(events);
  };

  const disposeTree = (): void => {
    set({
      tree: nothing(),
      currentStateId: nothing(),
      currentDialogueId: nothing(),
    });
  };

  const selectResponse = async (response: DialogueResponse, source: string): Promise<void> => runTransition(async () => {
    const { tree, currentStateId } = get();
    await appendStateToHistory(tree, currentStateId, response, source);

    response.args?.onEnter?.();

    if (isDestructor(response.jumpTo)) {
      disposeTree();
      return;
    }

    const externDialogueId = getExternDialogueId(response.responseId, response.jumpTo);
    if (externDialogueId) {
      await loadDialogueTree(externDialogueId, response.jumpTo);
      return;
    }

    set({ currentStateId: response.jumpTo });
  });

  const loadDialoguesIds = async (): Promise<void> => {
    const {
      serverUrl,
      ghostDir,
    } = runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).getState();

    if (!ghostDir) throw new Error('Ghost directory should be initialized here');

    set({ loading: true });
    const { error, data } = await postApiGhostDialogue({
      client,
      baseURL: serverUrl,
      body: { ghostDir }, // may use server filter here, but nah
    }).finally(() => set({ loading: false }));

    if (error) {
      console.error(error);
      set({ dialogues: [] });
    }
    else {
      set({
        dialogues: data,
      });
    }
  };

  const setCurrentStateId = (targetStateId: StateId): void => {
    if (isDestructor(targetStateId)) disposeTree();
    else set({ currentStateId: targetStateId });
  };

  return {
    loading: false,

    dialogues: [],
    tree: nothing(),

    currentDialogueId: nothing(),
    setCurrentDialogueId: (dialogueId: string) => set({ currentDialogueId: dialogueId }),

    currentStateId: nothing(),
    setCurrentStateId,

    selectResponse,

    loadDialoguesIds,

    loadDialogue: async (
      dialogueId: string,
      targetStateId: Maybe<StateId>,
      source: string,
    ): Promise<void> => runTransition(async () => {
      const { tree, currentStateId } = get();
      await loadDialogueTree(dialogueId, targetStateId);
      if (source !== 'header') await appendStateToHistory(tree, currentStateId, nothing(), source);
    }),

    disposeDialogue: async (source: string): Promise<void> => runTransition(async () => {
      const { tree, currentStateId } = get();
      await appendStateToHistory(tree, currentStateId, nothing(), source);
      disposeTree();
    }),

  };
};
