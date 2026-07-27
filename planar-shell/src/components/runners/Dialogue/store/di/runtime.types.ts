import type { Maybe } from '@planar/shared';
import type { StoreApi } from 'zustand/vanilla';
import type { DisposeFunction } from '../helpers';

export const dialogueStoreId = {
  localStorage: 'localStorage',
  tlk: 'tlk',
  gameHistory: 'gameHistory',
  dialogue: 'dialogue',
  dialogueView: 'dialogueView',
} as const;
export type DialogueStoreId = typeof dialogueStoreId[keyof typeof dialogueStoreId];

export type AnyStore = StoreApi<unknown>;

// TODO [snow]: RuntimeEntry to Readonly
export type RuntimeEntry = {
  store: AnyStore;
  leases: number;
  dispose: Maybe<DisposeFunction>;
};

export type StoreDefinition = Readonly<{
  dependencies: DialogueStoreId[];
  create: (runtime: DialogueRuntime) => AnyStore;
  start?: Maybe<(store: AnyStore) => DisposeFunction>;
}>;

export type DialogueRuntime = Readonly<{
  getStore: <T>(id: DialogueStoreId) => StoreApi<T>;
  acquire: (id: DialogueStoreId) => DisposeFunction;
}>;
