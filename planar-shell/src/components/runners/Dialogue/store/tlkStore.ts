import { LRUCache } from 'lru-cache';
import { dialogueRepository } from './dialogueRepository';
import { planarStoreId } from '@/engine/store/planarRuntime.types';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { Subscription } from 'rxjs';

import type { TlkStore } from './tlkStore.types';
import type { StateCreator } from 'zustand/vanilla';
import type { PlanarRuntime } from '@/engine/store/planarRuntime.types';
import type { LocalStorageStore } from './localStorageStore.types';

export const createTlkStore = (runtime: PlanarRuntime): StateCreator<TlkStore> => (set) => {
  const tlkCacheMaxLines = runtime
    .getStore<LocalStorageStore>(planarStoreId.localStorage)
    .getState()
    .tlkCacheMaxLines;

  let lru = new LRUCache<number, string>({ max: tlkCacheMaxLines });
  let revision = 0;

  const bumpRevision = (): number => {
    revision += 1;
    return revision;
  };

  const touchRefs = (refs: number[]): void => {
    for (const ref of refs) lru.get(ref);
  };

  const getLine = (ref: number): string | undefined => lru.peek(ref);

  const setMany = (items: Iterable<[number, string]>): void => {
    for (const [ref, line] of items) lru.set(ref, line);
  };

  const invalidateTlk = async (): Promise<void> => {
    const oldTlks = [...lru.entries()];
    revision = bumpRevision();
    lru.clear();
    try {
      await loadTlkRefs(oldTlks.map(x => x[0]));
    }
    catch (e: unknown) {
      console.error(e);
      setMany(oldTlks);
      // TODO [snow]: show error, that languages failed to change
    }
  };

  const resize = (max: number): void => {
    if (max === lru.max) return;

    console.info(`Resize tlk lru cache from '${lru.max}' to '${max}'`);

    const resizedLru = new LRUCache<number, string>({ max: max });
    for (const [ref, line] of [...lru.entries()].reverse()) {
      resizedLru.set(ref, line);
    }

    lru = resizedLru;
  };

  const fetchMissing = (missingTlkRefs: number[]): Promise<Map<number, string>> => {
    const { serverUrl, ghostDir, gameLanguage } = runtime
      .getStore<LocalStorageStore>(planarStoreId.localStorage)
      .getState();

    if (!ghostDir) throw new Error('Ghost directory cannot be empty here');
    if (!gameLanguage) throw new Error('Game language cannot be empty here');

    return dialogueRepository.loadTlkLines({
      serverUrl,
      ghostDir,
      gameLanguage,
      tlkRefs: missingTlkRefs,
    });
  };

  const loadTlkRefs = async (tlkRefs: number[]): Promise<void> => {
    touchRefs(tlkRefs);

    const missing = tlkRefs.filter(ref => lru.peek(ref) === undefined);
    if (missing.length === 0) return;

    const token = bumpRevision();
    set({ loading: true });

    try {
      const items = await fetchMissing(missing);
      const outdated = token !== revision;
      if (outdated) return;

      setMany(items);

      // if there is small lru cache, it can be lines here, that are still missing
      // because new loaded lines drop older lines
      // I just push lru cache size up and do not care

      set({ lines: new Map(lru.entries()) });
    }
    catch (e: unknown) {
      console.error(e);
      setMany(missing.map(x => [x, 'n/a']));
      // TODO [snow]: show error, that languages failed to load
    }
    finally {
      const outdated = token !== revision;
      if (!outdated) {
        set({ loading: false });
      }
    }
  };

  return {
    lines: new Map(),
    loading: false,

    loadTlkRefs,
    getLine,
    touchRefs,

    start: () => {
      const masterSubscription = new Subscription();

      masterSubscription.add(
        planarLocalStorage.onKeyChange('tlkCacheMaxLines').subscribe((key) => {
          const tlkCacheMaxLines = planarLocalStorage.get<number>(key)!;
          resize(tlkCacheMaxLines);
        }),
      );

      masterSubscription.add(
        planarLocalStorage.onKeyChange('gameLanguage').subscribe(() => {
          invalidateTlk().catch(e => console.error(e));
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('ghostDir').subscribe(() => {
          invalidateTlk().catch(e => console.error(e));
        }),
      );
      masterSubscription.add(
        planarLocalStorage.onKeyChange('serverUrl').subscribe(() => {
          invalidateTlk().catch(e => console.error(e));
        }),
      );

      return () => {
        masterSubscription.unsubscribe();
      };
    },
  };
};
