import { openDB } from 'idb';
import { DB_NAME } from '@planar/shared';
import { deleteDB } from 'idb';

import type { IDBPDatabase } from 'idb';

const storeNames = [
  'cres',
  'dlgs',
  'itms',
  'narrative',
  'characters',
] as const;
export type StoreName = typeof storeNames[number];

// TODO [snow]: do not pass strings as keys or ids, extract to constants
let dbPromise: Promise<IDBPDatabase> | null = null;

export const connect = () => {
  if (!dbPromise) {
    console.log('Recreate indexedDb');
    const version = 2;
    dbPromise = openDB(DB_NAME, version, {
      upgrade(db) {
        for (const storeName of storeNames) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: 'id',
            });
            store.createIndex('lastTouched', 'lastTouched');
          }
        }
        if (!db.objectStoreNames.contains('gameHistory')) {
          db.createObjectStore('gameHistory', {
            keyPath: 'sequenceId',
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains('gameHistoryRetentionPolicy')) {
          db.createObjectStore('gameHistoryRetentionPolicy', { keyPath: 'id' });
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
