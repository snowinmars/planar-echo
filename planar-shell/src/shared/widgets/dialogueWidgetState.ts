import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { DialogueWidgetActions, DialogueWidgetState } from './dialogueWidgetState.types';

const emptyState: DialogueWidgetState = {
  loading: false,
  dialogues: [],
  tree: nothing(),
  currentDialogueId: '',
  currentStateId: nothing(),
};

const state$ = new BehaviorSubject<DialogueWidgetState>(emptyState);

let actions: Maybe<DialogueWidgetActions> = nothing();

export const dialogueWidgetState = {
  getSnapshot: (): DialogueWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: DialogueWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: DialogueWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<DialogueWidgetActions> => actions,
};
