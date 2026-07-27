import {
  appendGameHistory,
  gameHistoryChanged$,
  getGameHistoryPage,
} from '@/shared/indexedDb';
import {
  gameHistorySettingsKeys,
  getGameHistoryBrowsedPages,
  getGameHistoryPageSize,
} from '@/shared/gameHistorySettings';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { dialogueStoreId } from './di/runtime.types';
import { mapTlkRefs } from './helpers';
import { Subscription } from 'rxjs';

import type {
  GameHistoryChange,
  GameHistoryPage,
} from '@/shared/indexedDb';
import type { GameHistoryStore } from './gameHistoryStore.types';
import type { StateCreator } from 'zustand/vanilla';
import type { DialogueRuntime } from './di/runtime.types';
import type { TlkStore } from './tlkStore.types';
import type { DisposeFunction } from './helpers';

const getMaxEntries = (): number => (
  // TODO [snow]: wrong: use indexedDb
  getGameHistoryPageSize() * Math.max(1, getGameHistoryBrowsedPages())
);

const reduceChanges = (
  currentWindow: GameHistoryPage,
  changes: GameHistoryChange[],
): GameHistoryPage => changes.reduce((nextWindow, change) => {
  if (change.type === 'replaceWindow') return change.page;

  const entries = [
    ...nextWindow.entries,
    ...change.entries,
  ].sort((lhs, rhs) => lhs.sequenceId - rhs.sequenceId);
  const maxEntries = getMaxEntries();

  return {
    entries: entries.slice(-maxEntries),
    hasOlder: nextWindow.hasOlder || entries.length > maxEntries,
    hasNewer: false,
  };
}, currentWindow);

export const createGameHistoryStore = (runtime: DialogueRuntime): StateCreator<GameHistoryStore> => (set, get) => {
  let requestId = 0;

  const updatePage = (page: GameHistoryPage): void => {
    set({
      ...page,
      revision: get().revision + 1,
    });

    const { entries } = get();

    runtime.getStore<TlkStore>(dialogueStoreId.tlk).getState()
      .loadTlkRefs(mapTlkRefs(entries.map(x => ({ ref: x.tlkRef }))))
      .catch(e => console.error(e));
  };

  const loadPageEntries = async (callback: (id: number) => Promise<void>): Promise<void> => {
    const id = requestId + 1; // beware of ++x vs x++
    set({ loading: true });

    try {
      await callback(id);
    }
    catch (e: unknown) {
      const outdated = id !== requestId;
      if (outdated) console.warn(e);
      else console.error(e);
    }
    finally {
      const outdated = id !== requestId;
      if (!outdated) set({ loading: false });
    }
  };

  const loadNewest = async (): Promise<void> => {
    await loadPageEntries(async (id) => {
      const page = await getGameHistoryPage({ limit: getMaxEntries() });
      const outdated = id !== requestId;
      if (outdated) return;
      updatePage(page);
    });
  };

  const loadOlder = async (): Promise<void> => {
    const {
      entries,
      loading,
      hasOlder,
    } = get();

    const oldest = entries.length && entries[0]!.sequenceId;
    if (loading || !hasOlder) return;
    if (!oldest) throw new Error(`hasOlder is '${hasOlder}', but I cannot find oldest from entries`);

    await loadPageEntries(async (id) => {
      const {
        entries,
        hasNewer,
      } = get();
      const oldest = entries.length && entries[0]!.sequenceId;
      if (!oldest) throw new Error(`I cannot find oldest from entries`);

      const page = await getGameHistoryPage({
        limit: getGameHistoryPageSize(),
        beforeSequenceId: oldest,
      });

      const outdated = id !== requestId;
      if (outdated) return;

      const olderEntries = [...page.entries, ...entries];
      const maxEntries = getMaxEntries();
      updatePage({
        entries: olderEntries.slice(0, maxEntries),
        hasOlder: page.hasOlder,
        hasNewer: olderEntries.length > maxEntries || hasNewer,
      });
    });
  };

  const loadNewer = async (): Promise<void> => {
    const {
      entries,
      loading,
      hasNewer,
    } = get();
    const newest = entries[entries.length - 1]?.sequenceId;
    if (loading || !hasNewer || newest === undefined) return;

    await loadPageEntries(async (id) => {
      const {
        entries,
        hasOlder,
      } = get();

      const page = await getGameHistoryPage({
        limit: getGameHistoryPageSize(),
        afterSequenceId: newest,
      });

      const outdated = id !== requestId;
      if (outdated) return;

      const newerEntries = [...entries, ...page.entries];
      const maxEntries = getMaxEntries();
      updatePage({
        entries: newerEntries.slice(-maxEntries),
        hasOlder: newerEntries.length > maxEntries || hasOlder,
        hasNewer: page.hasNewer,
      });
    });
  };

  const start = (): DisposeFunction => {
    const masterSubscription = new Subscription();
    loadNewest().catch((e: unknown) => console.error(e));

    masterSubscription.add(
      gameHistoryChanged$.subscribe((changes) => {
        set(state => ({
          ...reduceChanges(state, changes),
          loading: false,
          revision: state.revision + 1,
        }));

        const { entries } = get();

        runtime.getStore<TlkStore>(dialogueStoreId.tlk).getState()
          .loadTlkRefs(mapTlkRefs(entries.map(x => ({ ref: x.tlkRef }))))
          .catch(e => console.error(e));
      }),
    );

    masterSubscription.add(
      planarLocalStorage.onKeyChange(gameHistorySettingsKeys.pageSize).subscribe(() => {
        const loadNewest = get().loadNewest;
        loadNewest().catch(e => console.error(e));
      }),
    );

    masterSubscription.add(
      planarLocalStorage.onKeyChange(gameHistorySettingsKeys.browsedPages).subscribe(() => {
        const loadNewest = get().loadNewest;
        loadNewest().catch(e => console.error(e));
      }),
    );
    return () => {
      requestId = requestId + 1;
      masterSubscription.unsubscribe();
    };
  };

  return {
    entries: [],
    hasOlder: false,
    hasNewer: false,

    loading: false,
    revision: 0,

    append: async (events): Promise<void> => await appendGameHistory(...events),
    activateView: async (): Promise<void> => await loadNewest(),

    loadNewest,
    loadOlder,
    loadNewer,

    start,
  };
};
