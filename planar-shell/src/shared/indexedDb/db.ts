import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME } from '@planar/shared';
import { deleteDB } from 'idb';

const storeNames = [
  'creatures',
  'dialogues',
  'items',
  'narrative',
  'characters',
] as const;
export type StoreName = typeof storeNames[number];

let dbPromise: Promise<IDBPDatabase> | null = null;

export const connect = () => {
  if (!dbPromise) {
    console.log('Recreate indexedDb');
    const version = 2;
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
export const deleteDb = async () => {
  if (dbPromise) {
    const db = await dbPromise;
    db.close();
  }
  dbPromise = null;
  await deleteDB(DB_NAME);
};
