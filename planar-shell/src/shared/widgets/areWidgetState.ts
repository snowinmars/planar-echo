import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { AreWidgetActions, AreWidgetState } from './areWidgetState.types';

const emptyState: AreWidgetState = {
  loading: false,
  ares: [],
  currentAreId: nothing(),
};

const state$ = new BehaviorSubject<AreWidgetState>(emptyState);

let actions: Maybe<AreWidgetActions> = nothing();

export const areWidgetState = {
  getSnapshot: (): AreWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: AreWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: AreWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<AreWidgetActions> => actions,
};
