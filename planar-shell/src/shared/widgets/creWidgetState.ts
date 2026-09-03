import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { CreWidgetActions, CreWidgetState } from './creWidgetState.types';

const emptyState: CreWidgetState = {
  loading: false,
  cres: [],
  currentCreId: nothing(),
};

const state$ = new BehaviorSubject<CreWidgetState>(emptyState);

let actions: Maybe<CreWidgetActions> = nothing();

export const creWidgetState = {
  getSnapshot: (): CreWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: CreWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: CreWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<CreWidgetActions> => actions,
};
