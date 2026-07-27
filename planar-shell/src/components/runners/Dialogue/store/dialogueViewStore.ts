import { nothing } from '@planar/shared';
import {
  getZustandCharacter,
  getZustandNarrative,
} from '@/engine/store/worldStores';
import { getExternDialogueId, isDestructor, mapTlkRefs, type DisposeFunction } from './helpers';
import { dialogueStoreId } from './di/runtime.types';

import type { StateCreator, StoreApi } from 'zustand/vanilla';
import type { Maybe, NpcDialogue, StateId } from '@planar/shared';
import type { DialogueRuntime } from './di/runtime.types';
import type { DialogueStore } from './dialogueStore.types';
import type { LocalStorageStore } from './localStorageStore.types';
import type { TlkStore } from './tlkStore.types';
import type {
  CurrentDialogueView,
  DialogueViewResponse,
  DialogueViewStore,
} from './dialogueViewStore.types';

const createView = (
  tree: NpcDialogue,
  currentStateId: StateId,
  settings: LocalStorageStore,
): CurrentDialogueView => {
  const { says, responses } = tree.tree.get(currentStateId)!;
  const visibleResponses = responses.filter((response) => {
    const unconditional = !response.args?.onlyIf;
    const passCheck = response.args?.onlyIf && response.args.onlyIf();
    return unconditional || passCheck;
  });
  const viewResponses = visibleResponses.map((response, index): DialogueViewResponse => {
    if (isDestructor(response.jumpTo)) {
      return {
        response,
        index,
        kind: 'destructor',
        marker: settings.dialogueMarks.markDisposers ? '✕' : '',
      };
    }

    const externDialogueId = getExternDialogueId(response.responseId, response.jumpTo);
    if (externDialogueId) {
      return {
        response,
        index,
        kind: 'extern',
        marker: settings.dialogueMarks.markExterns ? `→ ${externDialogueId}` : '',
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
    useTwoColumns: settings.dialogueRenderer === 'pstee-two-columns',
  };
};

export const createDialogueViewStore = (runtime: DialogueRuntime): StateCreator<DialogueViewStore> => (set) => {
  const refresh = (): void => {
    const { tree, currentStateId } = runtime.getStore<DialogueStore>(dialogueStoreId.dialogue).getState();
    if (!tree || !currentStateId) {
      set({ view: nothing() });
      return;
    }

    const settings = runtime.getStore<LocalStorageStore>(dialogueStoreId.localStorage).getState();
    const view = createView(tree, currentStateId, settings);
    set({ view });

    runtime.getStore<TlkStore>(dialogueStoreId.tlk).getState()
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
        runtime.getStore<DialogueStore>(dialogueStoreId.dialogue).subscribe((state, prevState) => {
          const navigationChanged = state.tree !== prevState.tree
            || state.currentStateId !== prevState.currentStateId
            || state.currentDialogueId !== prevState.currentDialogueId
          ;
          if (!navigationChanged) return;

          rebindWorldStores();
          refresh();
        }),
      );
      subscriptions.push(
        runtime.getStore<LocalStorageStore>(dialogueStoreId.localStorage).subscribe(refresh),
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
