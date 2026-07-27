import { bufferTime, filter, share, Subject } from 'rxjs';
import { connect } from './db';
import {
  getGameHistoryPageSize,
  getGameHistoryBrowsedPages,
} from '../gameHistorySettings';
import { historyRetentionPolicyStoreId } from './gameHistory.types';

import type {
  GameHistoryChange,
  GameHistoryEntry,
  GameHistoryEvent,
  GameHistoryPage,
  GetGameHistoryPageProps,
  HistoryRetentionPolicy,
} from './gameHistory.types';
import { isNothing, nothing, type Maybe } from '@planar/shared';
import type { IDBPObjectStore } from 'idb';

const historyChangedSubject = new Subject<GameHistoryChange>();
export const gameHistoryChanged$ = historyChangedSubject.pipe(
  bufferTime(50),
  filter(changes => changes.length > 0),
  share(),
);

const toRange = (beforeSequenceId: Maybe<number>, afterSequenceId: Maybe<number>): IDBKeyRange | undefined => {
  if (!isNothing(beforeSequenceId) && !isNothing(afterSequenceId)) {
    throw new Error(`Only one game history continuation token can be used at a time, but not '${beforeSequenceId}' and '${afterSequenceId}'`);
  }

  if (!isNothing(beforeSequenceId)) return IDBKeyRange.upperBound(beforeSequenceId, true);
  if (!isNothing(afterSequenceId)) return IDBKeyRange.lowerBound(afterSequenceId, true);
  return undefined; // not nothing() // default is *
};

const pruneOldEntries = async (
  historyStore: IDBPObjectStore<unknown, string[], 'gameHistory', 'readwrite'>,
  storedPages: Maybe<number>,
): Promise<boolean> => {
  let pruned = false;
  const shouldPrune = !isNothing(storedPages);
  if (shouldPrune) {
    const count = await historyStore.count();
    let remaining = Math.max(0, count - storedPages);
    let cursor = await historyStore.openCursor(undefined, 'next'); // forward to sequenceId key (from older to newer)
    while (cursor && remaining > 0) {
      await cursor.delete();
      remaining--;
      pruned = true;
      cursor = await cursor.continue();
    }
  }

  return pruned;
};

// component will replace its history with the page
// without this page, components will be folcer to either:
//   - reread database per 'replaceWindow' event
//   - have custom 'shift old data' logic per component
// This idea seems less evil
const formPage = async (
  historyStore: IDBPObjectStore<unknown, string[], 'gameHistory', 'readwrite'>,
): Promise<Maybe<GameHistoryPage>> => {
  const pageSize = getGameHistoryPageSize();
  const browsedPages = getGameHistoryBrowsedPages();
  const limit = pageSize * browsedPages;
  const tailEntries: GameHistoryEntry[] = [];
  let cursor = await historyStore.openCursor(undefined, 'prev'); // backwards to sequenceId key (from newer to older)
  while (cursor && tailEntries.length < limit) {
    tailEntries.push(cursor.value as GameHistoryEntry);
    cursor = await cursor.continue();
  }

  const page: Maybe<GameHistoryPage> = {
    entries: tailEntries.reverse(),
    hasOlder: cursor !== null,
    hasNewer: false,
  };

  return page;
};

export const appendGameHistory = async (...events: GameHistoryEvent[]): Promise<void> => {
  if (events.length === 0) return;

  const db = await connect();
  const tx = db.transaction(['gameHistory', 'gameHistoryRetentionPolicy'], 'readwrite');
  const historyStore = tx.objectStore('gameHistory');
  const historyRetentionPolicyStore = tx.objectStore('gameHistoryRetentionPolicy');
  const timestamp = Date.now();
  const entries: GameHistoryEntry[] = [];

  // save history
  for (const event of events) {
    const sequenceId = await historyStore.add({ ...event, timestamp });
    if (typeof sequenceId !== 'number') throw new Error('Game history sequence id must be a number');
    entries.push({ ...event, sequenceId, timestamp });
  }

  const settings = await historyRetentionPolicyStore.get(historyRetentionPolicyStoreId) as Maybe<HistoryRetentionPolicy>;
  const pruned = await pruneOldEntries(historyStore, settings?.storedPages);

  const page = pruned ? await formPage(historyStore) : nothing();

  await tx.done;

  if (page) historyChangedSubject.next({ type: 'replaceWindow', page });
  else historyChangedSubject.next({ type: 'append', entries });
};

export const getGameHistoryPage = async ({
  limit,
  beforeSequenceId,
  afterSequenceId,
}: GetGameHistoryPageProps): Promise<GameHistoryPage> => {
  /**
   * if beforeSequenceId: range = (.., beforeSequenceId); direction = 'next' = forward to sequenceId key (from older to newer)
   * if beforeSequenceId: range = (beforeSequenceId, ..); direction = 'prev' = backwards to sequenceId key (from newer to older)
   * otherwise          : range = (.., ..)              ; direction = 'prev' = backwards to sequenceId key (from newer to older)
   */
  const range = toRange(beforeSequenceId, afterSequenceId);
  const direction = afterSequenceId === undefined ? 'prev' : 'next';

  const db = await connect();
  const tx = db.transaction('gameHistory', 'readonly');
  const store = tx.objectStore('gameHistory');
  const entries: GameHistoryEntry[] = [];

  let cursor = await store.openCursor(range, direction);
  while (cursor && entries.length < limit) {
    entries.push(cursor.value as GameHistoryEntry);
    cursor = await cursor.continue();
  }

  if (entries.length === 0) return {
    entries,
    hasOlder: false,
    hasNewer: false,
  };

  if (direction === 'prev') entries.reverse();
  const oldest = entries[0]!.sequenceId;
  const newest = entries[entries.length - 1]!.sequenceId;

  let hasOlder = false;
  if (oldest !== undefined) {
    const olderCursor = await store.openCursor(IDBKeyRange.upperBound(oldest, true), 'prev');
    hasOlder = olderCursor !== null;
  }

  let hasNewer = false;
  if (newest !== undefined) {
    const newerCursor = await store.openCursor(IDBKeyRange.lowerBound(newest, true), 'next');
    hasNewer = newerCursor !== null;
  }

  await tx.done;

  return {
    entries,
    hasOlder,
    hasNewer,
  };
};

export const applyGameHistoryStorageLimit = async (storedPages: Maybe<number>): Promise<void> => {
  if (!isNothing(storedPages) && storedPages < 1) {
    throw new Error(`Invalid game history max entries: ${storedPages}`);
  }

  const db = await connect();
  const tx = db.transaction(['gameHistory', 'gameHistoryRetentionPolicy'], 'readwrite');
  const historyStore = tx.objectStore('gameHistory');
  const historyRetentionPolicyStore = tx.objectStore('gameHistoryRetentionPolicy');

  await historyRetentionPolicyStore.put({
    id: historyRetentionPolicyStoreId,
    storedPages,
  } satisfies HistoryRetentionPolicy);

  const pruned = await pruneOldEntries(historyStore, storedPages);

  const page = pruned ? await formPage(historyStore) : nothing();

  await tx.done;

  if (page) historyChangedSubject.next({ type: 'replaceWindow', page });
};
