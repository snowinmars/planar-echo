import { nothing } from '@planar/shared';

import { connect } from './db';

import type { Maybe } from '@planar/shared';

import type { StoreName } from './db';

export type CachedSkeletonItem = Readonly<{
  id: string;
  skeleton: string;
  lastTouched: number;
}>;

export const getSkeletonItem = async (storeName: StoreName, id: string): Promise<Maybe<CachedSkeletonItem>> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const entry: Maybe<CachedSkeletonItem> = await store.get(id);
  if (!entry) return nothing();

  const lastTouched = Date.now();
  const touched: CachedSkeletonItem = { ...entry, lastTouched };
  await store.put(touched);
  await tx.done;

  return touched;
};

export const setSkeletonItem = async (storeName: StoreName, id: string, skeleton: string): Promise<void> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const touched: CachedSkeletonItem = {
    id,
    skeleton,
    lastTouched: Date.now(),
  };

  await store.put(touched);
  await tx.done;
};

export type WorldStateItem<T> = Readonly<{
  id: string;
  state: T;
  lastTouched: number;
}>;

export const getWorldState = async <T>(storeName: StoreName, id: string): Promise<Maybe<WorldStateItem<T>>> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const entry: Maybe<WorldStateItem<T>> = await store.get(id);
  if (!entry) return nothing();

  const lastTouched = Date.now();
  const touched: WorldStateItem<T> = { ...entry, lastTouched };
  await store.put(touched);
  await tx.done;

  return touched;
};

export const setWorldState = async <T>(storeName: StoreName, id: string, state: T): Promise<void> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const touched: WorldStateItem<T> = {
    id,
    state,
    lastTouched: Date.now(),
  };

  await store.put(touched);
  await tx.done;
};
