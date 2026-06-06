import { DB_NAME, nothing } from '@planar/shared';
import { openDB } from 'idb';

import type { Maybe } from '@planar/shared';
import type { IDBPDatabase } from 'idb';

export type CachedDialogue = Readonly<{
  id: string;
  skeleton: string;
  translation: string;
  lastTouched: number;
}>;

const STORE_NAME = 'dialogues';
let dbPromise: Promise<IDBPDatabase> | null = null;

const connect = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('lastTouched', 'lastTouched');
        }
      },
    });
  }

  return dbPromise;
};

export const getDialogue = async (id: string): Promise<Maybe<CachedDialogue>> => {
  const db = await connect();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);

  const entry: Maybe<CachedDialogue> = await store.get(id);
  if (!entry) return nothing();

  const lastTouched = Date.now();
  await store.put({
    ...entry,
    lastTouched,
  });
  await tx.done;

  return {
    id,
    skeleton: entry.skeleton,
    translation: entry.translation,
    lastTouched,
  };
};

export const setDialogue = async (id: string, skeleton: string, translation: string): Promise<void> => {
  const db = await connect();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({
    id,
    skeleton,
    translation,
    lastTouched: Date.now(),
  });
  await tx.done;
};
