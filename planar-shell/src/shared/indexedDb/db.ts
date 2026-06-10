import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME } from '@planar/shared';

const storeNames = [
  'creatures',
  'dialogues',
] as const;
export type StoreName = typeof storeNames[number];

let dbPromise: Promise<IDBPDatabase> | null = null;

export const connect = () => {
  if (!dbPromise) {
    const version = 1;
    dbPromise = openDB(DB_NAME, version, {
      upgrade(db) {
        for (const storeName of storeNames) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('lastTouched', 'lastTouched');
          }
        }
      },
    });
  }
  return dbPromise;
};
