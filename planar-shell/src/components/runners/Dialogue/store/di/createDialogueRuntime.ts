import { createStore } from 'zustand/vanilla';
import { createDialogueStore } from '../dialogueStore';
import { createDialogueViewStore } from '../dialogueViewStore';
import { createGameHistoryStore } from '../gameHistoryStore';
import { createLocalStorageStore } from '../localStorageStore';
import { createTlkStore } from '../tlkStore';
import { dialogueStoreId } from './runtime.types';

import type { StoreApi } from 'zustand/vanilla';
import type { DialogueViewStore } from '../dialogueViewStore.types';
import type { GameHistoryStore } from '../gameHistoryStore.types';
import type { LocalStorageStore } from '../localStorageStore.types';
import type { TlkStore } from '../tlkStore.types';
import type {
  DialogueRuntime,
  DialogueStoreId,
  RuntimeEntry,
  StoreDefinition,
} from './runtime.types';
import { nothing } from '@planar/shared';
import type { DisposeFunction } from '../helpers';

const definitions: Record<DialogueStoreId, StoreDefinition> = {
  [dialogueStoreId.localStorage]: {
    dependencies: [],
    create: () => createStore(createLocalStorageStore),
    start: store => (store as StoreApi<LocalStorageStore>).getState().start(),
  },
  [dialogueStoreId.tlk]: {
    dependencies: [dialogueStoreId.localStorage],
    create: runtime => createStore(createTlkStore(runtime)),
    start: store => (store as StoreApi<TlkStore>).getState().start(),
  },
  [dialogueStoreId.gameHistory]: {
    dependencies: [dialogueStoreId.localStorage, dialogueStoreId.tlk],
    create: runtime => createStore(createGameHistoryStore(runtime)),
    start: store => (store as StoreApi<GameHistoryStore>).getState().start(),
  },
  [dialogueStoreId.dialogue]: {
    dependencies: [dialogueStoreId.localStorage, dialogueStoreId.tlk, dialogueStoreId.gameHistory],
    create: runtime => createStore(createDialogueStore(runtime)),
  },
  [dialogueStoreId.dialogueView]: {
    dependencies: [dialogueStoreId.dialogue, dialogueStoreId.localStorage, dialogueStoreId.tlk],
    create: runtime => createStore(createDialogueViewStore(runtime)),
    start: store => (store as StoreApi<DialogueViewStore>).getState().start(),
  },
};

export const createDialogueRuntime = (): DialogueRuntime => {
  const entries = new Map<DialogueStoreId, RuntimeEntry>();

  const getStore = <T>(id: DialogueStoreId): StoreApi<T> => {
    const existing = entries.get(id);
    if (existing) return existing.store as StoreApi<T>;

    const definition = definitions[id];
    for (const dependency of definition.dependencies) getStore(dependency);

    const entry: RuntimeEntry = {
      store: definition.create(runtime),
      leases: 0,
      dispose: nothing(),
    };
    entries.set(id, entry);
    return entry.store as StoreApi<T>;
  };

  const getEntry = (id: DialogueStoreId): RuntimeEntry => {
    getStore(id);
    return entries.get(id)!;
  };

  const acquire = (id: DialogueStoreId): DisposeFunction => {
    const definition = definitions[id];
    const disposeDependencies = definition.dependencies.map(dependency => acquire(dependency));
    const entry = getEntry(id);

    if (entry.leases === 0) entry.dispose = definition.start?.(entry.store);
    entry.leases++;

    let released = false;
    return (): void => {
      if (released) return;
      released = true;

      entry.leases--;
      if (entry.leases === 0) {
        entry.dispose?.();
        entry.dispose = nothing();
      }

      for (const disposeDependency of disposeDependencies.reverse()) disposeDependency();
    };
  };

  const runtime: DialogueRuntime = {
    getStore,
    acquire,
  };

  return runtime;
};
