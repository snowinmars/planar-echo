import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { EffWidgetActions, EffWidgetState } from './effWidgetState.types';

const emptyState: EffWidgetState = {
  loading: false,
  effs: [],
  currentEffId: nothing(),
};

const state$ = new BehaviorSubject<EffWidgetState>(emptyState);

let actions: Maybe<EffWidgetActions> = nothing();

export const effWidgetState = {
  getSnapshot: (): EffWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: EffWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: EffWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<EffWidgetActions> => actions,
};
