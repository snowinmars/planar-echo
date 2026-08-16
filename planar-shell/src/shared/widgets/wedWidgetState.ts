import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { WedWidgetActions, WedWidgetState } from './wedWidgetState.types';

const emptyState: WedWidgetState = {
  loading: false,
  weds: [],
  currentWedId: nothing(),
};

const state$ = new BehaviorSubject<WedWidgetState>(emptyState);

let actions: Maybe<WedWidgetActions> = nothing();

export const wedWidgetState = {
  getSnapshot: (): WedWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: WedWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: WedWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<WedWidgetActions> => actions,
};
