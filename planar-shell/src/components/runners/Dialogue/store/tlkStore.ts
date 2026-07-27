import { dialogueRepository } from './dialogueRepository';
import { dialogueStoreId } from './di/runtime.types';

import type {
  LoadTlkRefsProps,
  SourceId,
  TlkSource,
  TlkStore,
} from './tlkStore.types';
import type { StateCreator } from 'zustand/vanilla';
import type { DialogueRuntime } from './di/runtime.types';
import type { LocalStorageStore } from './localStorageStore.types';

export const createTlkStore = (runtime: DialogueRuntime): StateCreator<TlkStore> => (set, get) => {
  const setEmptySource = ({
    tlkRefs,
    sourceId,
  }: LoadTlkRefsProps): number => {
    const current = get().sources.get(sourceId);

    const revision = (current?.revision ?? 0) + 1;
    const nextSource: TlkSource = {
      tlkRefs: [...tlkRefs],
      lines: new Map(),
      loading: tlkRefs.length > 0,
      revision,
    };

    set(state => ({
      sources: new Map(state.sources).set(sourceId, nextSource),
    }));

    return revision;
  };

  const loadTlkRefs = async ({
    tlkRefs,
    sourceId,
  }: LoadTlkRefsProps): Promise<void> => {
    const revision = setEmptySource({
      tlkRefs,
      sourceId,
    });
    if (tlkRefs.length === 0) return;

    const { serverUrl, ghostDir, gameLanguage } = runtime
      .getStore<LocalStorageStore>(dialogueStoreId.localStorage)
      .getState();

    try {
      const items = await dialogueRepository.loadTlkLines({
        serverUrl,
        ghostDir,
        gameLanguage,
        tlkRefs,
      });

      const latest = get().sources.get(sourceId);
      const alreadyDisposed = !latest;
      const outdated = latest && latest.revision !== revision;
      if (alreadyDisposed || outdated) return;

      set(state => ({
        sources: new Map(state.sources).set(sourceId, {
          ...latest,
          lines: items,
          loading: false,
        }),
      }));
    }
    catch (e: unknown) {
      console.error(e);
      const latest = get().sources.get(sourceId);
      if (latest?.revision === revision) {
        set(state => ({
          sources: new Map(state.sources).set(sourceId, {
            ...latest,
            loading: false,
          }),
        }));
      }
      throw e;
    }
  };

  const reloadTlkRefs = async (next: LocalStorageStore, previous: LocalStorageStore): Promise<void> => {
    const settingsChanged = (
      next.serverUrl !== previous.serverUrl
      || next.ghostDir !== previous.ghostDir
      || next.gameLanguage !== previous.gameLanguage
    );
    if (!settingsChanged) return;

    const sources = [...get().sources.entries()]; // snapshot
    for (const [sourceId, source] of sources) {
      await loadTlkRefs({
        tlkRefs: source.tlkRefs,
        sourceId,
      });
    }
  };

  return ({
    sources: new Map<SourceId, TlkSource>(),

    loadTlkRefs,

    release: (sourceId): void => {
      if (!get().sources.has(sourceId)) return;

      set((state) => {
        const sources = new Map(state.sources);
        sources.delete(sourceId);
        return { sources };
      });
    },

    start: () => {
      const unsubscribe = runtime.getStore<LocalStorageStore>(dialogueStoreId.localStorage)
        .subscribe((next, previous) => {
          reloadTlkRefs(next, previous).catch(e => console.error(e));
        });

      return unsubscribe;
    },
  });
};
