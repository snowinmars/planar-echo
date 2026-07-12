import { connect, StoreName } from './db';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export type CachedTranslatedSkeletonItem = {
  id: string;
  skeleton: string;
  translation: string;
  lastTouched: number;
};

export const getTranslatedSkeletonItem = async (storeName: StoreName, id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const entry: Maybe<CachedTranslatedSkeletonItem> = await store.get(id);
  if (!entry) return nothing();

  const lastTouched = Date.now();
  const touched: CachedTranslatedSkeletonItem = { ...entry, lastTouched };
  await store.put(touched);
  await tx.done;

  return touched;
};

export const setTranslatedSkeletonItem = async (storeName: StoreName, id: string, skeleton: string, translation: string): Promise<void> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const touched: CachedTranslatedSkeletonItem = {
    id,
    skeleton,
    translation,
    lastTouched: Date.now(),
  };

  await store.put(touched);
  await tx.done;
};

export type WorldStateItem<T> = {
  id: string;
  state: T;
  lastTouched: number;
};

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
