import { nothing } from '@planar/shared';
import {
  getZustandCharacter,
  getZustandNarrative,
} from '@/engine/store/worldStores';
import { getExternDlgId, isDestructor, mapTlkRefs, type DisposeFunction } from './helpers';
import { planarStoreId } from '@/engine/store/planarRuntime.types';

import type { StateCreator, StoreApi } from 'zustand/vanilla';
import type { Maybe, GhostDlg, StateId } from '@planar/shared';
import type { PlanarRuntime } from '@/engine/store/planarRuntime.types';
import type { DlgStore } from './dlgStore.types';
import type { LocalStorageStore } from './localStorageStore.types';
import type { TlkStore } from './tlkStore.types';
import type {
  CurrentDlgView,
  DlgViewResponse,
  DlgViewStore,
} from './dlgViewStore.types';

const createView = (
  tree: GhostDlg,
  currentStateId: StateId,
  settings: LocalStorageStore,
): CurrentDlgView => {
  const { says, responses } = tree.tree.get(currentStateId)!;
  const visibleResponses = responses.filter((response) => {
    const unconditional = !response.args?.onlyIf;
    const passCheck = response.args?.onlyIf && response.args.onlyIf();
    return unconditional || passCheck;
  });
  const viewResponses = visibleResponses.map((response, index): DlgViewResponse => {
    if (isDestructor(response.jumpTo)) {
      return {
        response,
        index,
        kind: 'destructor',
        marker: settings.dlgMarks.markDisposers ? '✕' : '',
      };
    }

    const externDlgId = getExternDlgId(response.responseId, response.jumpTo);
    if (externDlgId) {
      return {
        response,
        index,
        kind: 'extern',
        marker: settings.dlgMarks.markExterns ? `→ ${externDlgId}` : '',
      };
    }

    return { response, index, kind: 'default', marker: '' };
  });

  return {
    says,
    responses: viewResponses,
    tlkRefs: [
      ...mapTlkRefs(says.map(say => ({ ref: say.textRef }))),
      ...mapTlkRefs(visibleResponses.map(response => ({ ref: response.responseRef }))),
    ],
    useTwoColumns: settings.dlgRenderer === 'pstee-two-columns',
  };
};

export const createDlgViewStore = (runtime: PlanarRuntime): StateCreator<DlgViewStore> => (set) => {
  const refresh = (): void => {
    const { tree, currentStateId } = runtime.getStore<DlgStore>(planarStoreId.dlg).getState();
    if (!tree || !currentStateId) {
      set({ view: nothing() });
      return;
    }

    const settings = runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).getState();
    const view = createView(tree, currentStateId, settings);
    set({ view });

    runtime.getStore<TlkStore>(planarStoreId.tlk).getState()
      .loadTlkRefs(view.tlkRefs)
      .catch((e: unknown) => console.error(e));
  };

  return {
    view: nothing(),
    refresh,
    start: () => {
      const subscriptions: DisposeFunction[] = [];
      let narrativeStore: Maybe<StoreApi<unknown>> = nothing();
      let characterStore: Maybe<StoreApi<unknown>> = nothing();
      let unsubscribeNarrative: Maybe<DisposeFunction> = nothing();
      let unsubscribeCharacter: Maybe<DisposeFunction> = nothing();

      const rebindWorldStores = (): void => {
        const nextNarrativeStore = getZustandNarrative();
        if (nextNarrativeStore !== narrativeStore) {
          unsubscribeNarrative?.();
          narrativeStore = nextNarrativeStore;
          unsubscribeNarrative = narrativeStore?.subscribe(refresh);
        }

        const nextCharacterStore = getZustandCharacter();
        if (nextCharacterStore !== characterStore) {
          unsubscribeCharacter?.();
          characterStore = nextCharacterStore;
          unsubscribeCharacter = characterStore?.subscribe(refresh);
        }
      };

      subscriptions.push(
        runtime.getStore<DlgStore>(planarStoreId.dlg).subscribe((state, prevState) => {
          const navigationChanged = state.tree !== prevState.tree
            || state.currentStateId !== prevState.currentStateId
            || state.currentDlgId !== prevState.currentDlgId
          ;
          if (!navigationChanged) return;

          rebindWorldStores();
          refresh();
        }),
      );
      subscriptions.push(
        runtime.getStore<LocalStorageStore>(planarStoreId.localStorage).subscribe(refresh),
      );

      rebindWorldStores();
      refresh();

      return () => {
        unsubscribeNarrative?.();
        unsubscribeCharacter?.();
        for (const unsubscribe of subscriptions) unsubscribe();
      };
    },
  };
};
