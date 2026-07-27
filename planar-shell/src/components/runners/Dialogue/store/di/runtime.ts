import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { dialogueStoreId } from './runtime.types';
import { createDialogueRuntime } from './createDialogueRuntime';

import type { StoreApi } from 'zustand/vanilla';
import type { DialogueStore } from '../dialogueStore.types';
import type { DialogueViewStore } from '../dialogueViewStore.types';
import type { GameHistoryStore } from '../gameHistoryStore.types';
import type { LocalStorageStore } from '../localStorageStore.types';
import type { TlkStore } from '../tlkStore.types';
import type { DialogueRuntime } from './runtime.types';

export const dialogueFeatureModules = [
  dialogueStoreId.dialogueView,
  dialogueStoreId.gameHistory,
] as const;

export const appDialogueRuntime = createDialogueRuntime();
export const DialogueRuntimeContext = createContext<DialogueRuntime>(appDialogueRuntime);
export const useRuntime = (): DialogueRuntime => useContext(DialogueRuntimeContext);

export const useDialogueStore = <T>(selector: (state: DialogueStore) => T): T => (
  useStore(useRuntime().getStore<DialogueStore>(dialogueStoreId.dialogue), selector)
);

export const useDialogueStoreApi = (): StoreApi<DialogueStore> => (
  useRuntime().getStore<DialogueStore>(dialogueStoreId.dialogue)
);

export const useDialogueViewStore = <T>(selector: (state: DialogueViewStore) => T): T => (
  useStore(useRuntime().getStore<DialogueViewStore>(dialogueStoreId.dialogueView), selector)
);

export const useTlkStore = <T>(selector: (state: TlkStore) => T): T => (
  useStore(useRuntime().getStore<TlkStore>(dialogueStoreId.tlk), selector)
);

export const useGameHistoryStore = <T>(selector: (state: GameHistoryStore) => T): T => (
  useStore(useRuntime().getStore<GameHistoryStore>(dialogueStoreId.gameHistory), selector)
);

export const useLocalStorageStore = <T>(selector: (state: LocalStorageStore) => T): T => (
  useStore(useRuntime().getStore<LocalStorageStore>(dialogueStoreId.localStorage), selector)
);
