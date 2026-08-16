import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { MosWidgetActions, MosWidgetState } from './mosWidgetState.types';

const emptyState: MosWidgetState = {
  loading: false,
  moss: [],
  currentMosId: nothing(),
};

const state$ = new BehaviorSubject<MosWidgetState>(emptyState);

let actions: Maybe<MosWidgetActions> = nothing();

export const mosWidgetState = {
  getSnapshot: (): MosWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: MosWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: MosWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<MosWidgetActions> => actions,
};
