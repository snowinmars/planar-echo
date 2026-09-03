import type { StoreApi } from 'zustand/vanilla';

import type { Maybe } from '@planar/shared';

export type DisposeFunction = () => void;

export const planarStoreId = {
  localStorage: 'localStorage',
  tlk: 'tlk',
  gameHistory: 'gameHistory',
  dlg: 'dlg',
  dlgView: 'dlgView',
} as const;
export type PlanarStoreId = typeof planarStoreId[keyof typeof planarStoreId];

export type AnyStore = StoreApi<unknown>;

// TODO [snow]: RuntimeEntry to Readonly
export type RuntimeEntry = {
  store: AnyStore;
  leases: number;
  dispose: Maybe<DisposeFunction>;
};

export type StoreDefinition = Readonly<{
  dependencies: PlanarStoreId[];
  create: (runtime: PlanarRuntime) => AnyStore;
  start?: Maybe<(store: AnyStore) => DisposeFunction>;
}>;

export type PlanarRuntime = Readonly<{
  getStore: <T>(id: PlanarStoreId) => StoreApi<T>;
  acquire: (id: PlanarStoreId) => DisposeFunction;
}>;
