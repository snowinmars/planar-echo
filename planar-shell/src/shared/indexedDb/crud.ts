import { connect, StoreName } from './db';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export type CachedTranslatedSkeletonItem = {
  id: string;
  skeleton: string;
  translation: string;
  lastTouched: number;
};

export const getItem = async (storeName: StoreName, id: string): Promise<Maybe<CachedTranslatedSkeletonItem>> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const entry: Maybe<CachedTranslatedSkeletonItem> = await store.get(id);
  if (!entry) return nothing();

  const lastTouched = Date.now();
  await store.put({ ...entry, lastTouched });
  await tx.done;

  return { ...entry, lastTouched };
};

export const setItem = async (storeName: StoreName, id: string, skeleton: string, translation: string): Promise<void> => {
  const db = await connect();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  await store.put({
    id,
    skeleton,
    translation,
    lastTouched: Date.now(),
  });
  await tx.done;
};
