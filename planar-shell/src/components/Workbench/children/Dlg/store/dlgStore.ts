import { nothing } from '@planar/shared';

import { planarStoreId } from '@/engine/store/planarRuntime.types';
import { getZustandCharacter, getZustandNarrative } from '@/engine/store/worldStores';
import { postApiGhostDlg } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { dlgRepository } from './dlgRepository';
import {
  chooseStartingStateId,
  getExternDlgId,
  isDestructor,
} from './helpers';

import type { StateCreator } from 'zustand/vanilla';

import type { GhostDlg, GhostDlgResponse, GhostDlgSay, Maybe, StateId } from '@planar/shared';

import type { PlanarRuntime } from '@/engine/store/planarRuntime.types';
import type { GameHistoryEvent } from '@/shared/indexedDb';

import type { DlgStore } from './dlgStore.types';
import type { GameHistoryStore } from './gameHistoryStore.types';
import type { LocalStorageStore } from './localStorageStore.types';

const createDlgHistoryEvents = (
  says: GhostDlgSay[],
  response: Maybe<GhostDlgResponse>,
  source: string,
): GameHistoryEvent[] => {
  return [
    ...says.map((say): GameHistoryEvent => ({
      kind: 'say',
      tlkRef: say.textRef,
      whoId: say.whoId,
      source,
    })),
    ...(response
      ? [{
          kind: 'response' as const,
          tlkRef: response.responseRef ?? null,
          whoId: 'nameless' as const,
          source,
        }]
      : []),
  ];
};

export const createDlgStore = (runtime: PlanarRuntime): StateCreator<DlgStore> => (set, get) => {
  const withLoading = async (fn: () => Promise<void>): Promise<void> => {
    set(s => ({ loading: s.loading + 1 }));
    await fn().finally(() => set(s => ({ loading: s.loading - 1 })));
  };

  const loadDlgTree = async (dlgId: string, initialStateId: Maybe<StateId>): Promise<void> => {
    const {
      serverUrl,
      ghostDir,
    } = runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).getState();

    const narrative = getZustandNarrative();
    const character = getZustandCharacter();

    if (!narrative || !character) throw new Error('World stores were not initialized');
    if (!ghostDir) throw new Error('Ghost directory should be initialized here');

    await withLoading(async () => {
      const tree = await dlgRepository.loadDlgTree({
        serverUrl,
        ghostDir,
        dlgId,
        narrative,
        character,
      });

      set({
        tree,
        currentDlgId: dlgId,
        currentStateId: initialStateId ?? chooseStartingStateId(tree),
      });
    });
  };

  const runTransition = async (transition: () => Promise<void>): Promise<void> => withLoading(transition);

  const appendStateToHistory = async (
    tree: Maybe<GhostDlg>,
    currentStateId: Maybe<StateId>,
    response: Maybe<GhostDlgResponse>,
    source: string,
  ): Promise<void> => {
    if (!tree || !currentStateId) return;
    const { says } = tree.tree.get(currentStateId)!;
    const events = createDlgHistoryEvents(says, response, source);
    await runtime.getStore<GameHistoryStore>(planarStoreId.gameHistory).getState().append(events);
  };

  const disposeTree = (): void => {
    set({
      tree: nothing(),
      currentStateId: nothing(),
      currentDlgId: nothing(),
    });
  };

  const selectResponse = async (response: GhostDlgResponse, source: string): Promise<void> => runTransition(async () => {
    const { tree, currentStateId } = get();
    await appendStateToHistory(tree, currentStateId, response, source);

    response.args?.onEnter?.();

    if (isDestructor(response.jumpTo)) {
      disposeTree();
      return;
    }

    const externDlgId = getExternDlgId(response.responseId, response.jumpTo);
    if (externDlgId) {
      await loadDlgTree(externDlgId, response.jumpTo);
      return;
    }

    set({ currentStateId: response.jumpTo });
  });

  const loadDlgsIds = async (): Promise<void> => {
    const {
      serverUrl,
      ghostDir,
    } = runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).getState();

    if (!ghostDir) throw new Error('Ghost directory should be initialized here');

    await withLoading(async () => {
      const { error, data } = await postApiGhostDlg({
        client,
        baseURL: serverUrl,
        body: { ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({ dlgs: [] });
      }
      else {
        set({
          dlgs: data,
        });
      }
    });
  };

  const setCurrentStateId = (targetStateId: StateId): void => {
    if (isDestructor(targetStateId)) disposeTree();
    else set({ currentStateId: targetStateId });
  };

  return {
    loading: 0,

    dlgs: [],
    tree: nothing(),

    currentDlgId: nothing(),
    setCurrentDlgId: (dlgId: string) => set({ currentDlgId: dlgId }),

    currentStateId: nothing(),
    setCurrentStateId,

    selectResponse,

    loadDlgsIds,

    loadDlg: async (
      dlgId: string,
      targetStateId: Maybe<StateId>,
      source: string,
    ): Promise<void> => runTransition(async () => {
      const { tree, currentStateId } = get();
      await loadDlgTree(dlgId, targetStateId);
      if (source !== 'header') await appendStateToHistory(tree, currentStateId, nothing(), source);
    }),

    disposeDlg: async (source: string): Promise<void> => runTransition(async () => {
      const { tree, currentStateId } = get();
      await appendStateToHistory(tree, currentStateId, nothing(), source);
      disposeTree();
    }),

  };
};
