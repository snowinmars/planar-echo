import { useStore } from 'zustand';
import { planarStoreId, useRuntime } from '@/engine/store/planarRuntime';

import type { StoreApi } from 'zustand/vanilla';
import type { DialogueStore } from '../dialogueStore.types';
import type { DialogueViewStore } from '../dialogueViewStore.types';
import type { GameHistoryStore } from '../gameHistoryStore.types';

export const dialogueFeatureModules = [
  planarStoreId.dialogueView,
  planarStoreId.gameHistory,
] as const;

export const useDialogueStore = <T>(selector: (state: DialogueStore) => T): T => (
  useStore(useRuntime().getStore<DialogueStore>(planarStoreId.dialogue), selector)
);

export const useDialogueStoreApi = (): StoreApi<DialogueStore> => (
  useRuntime().getStore<DialogueStore>(planarStoreId.dialogue)
);

export const useDialogueViewStore = <T>(selector: (state: DialogueViewStore) => T): T => (
  useStore(useRuntime().getStore<DialogueViewStore>(planarStoreId.dialogueView), selector)
);

export const useGameHistoryStore = <T>(selector: (state: GameHistoryStore) => T): T => (
  useStore(useRuntime().getStore<GameHistoryStore>(planarStoreId.gameHistory), selector)
);
