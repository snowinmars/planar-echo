import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { DialogueViewActions, DialogueViewState } from './dialogueViewState.types';

const emptyState: DialogueViewState = {
  loading: false,
  dialogues: [],
  tree: nothing(),
  currentDialogueId: nothing(),
  currentStateId: nothing(),
};

const state$ = new BehaviorSubject<DialogueViewState>(emptyState);

let actions: Maybe<DialogueViewActions> = nothing();

export const dialogueViewState = {
  getSnapshot: (): DialogueViewState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const sub = state$.subscribe(() => onStoreChange());
    return () => sub.unsubscribe();
  },

  publish: (state: DialogueViewState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: DialogueViewActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<DialogueViewActions> => actions,
};
