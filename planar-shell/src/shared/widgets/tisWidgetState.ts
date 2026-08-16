import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { TisWidgetActions, TisWidgetState } from './tisWidgetState.types';

const emptyState: TisWidgetState = {
  loading: false,
  tiss: [],
  currentTisId: nothing(),
};

const state$ = new BehaviorSubject<TisWidgetState>(emptyState);

let actions: Maybe<TisWidgetActions> = nothing();

export const tisWidgetState = {
  getSnapshot: (): TisWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: TisWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: TisWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<TisWidgetActions> => actions,
};
