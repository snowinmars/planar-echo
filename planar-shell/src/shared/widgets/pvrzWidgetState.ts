import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { PvrzWidgetActions, PvrzWidgetState } from './pvrzWidgetState.types';

const emptyState: PvrzWidgetState = {
  loading: false,
  pvrzs: [],
  currentPvrzId: nothing(),
};

const state$ = new BehaviorSubject<PvrzWidgetState>(emptyState);

let actions: Maybe<PvrzWidgetActions> = nothing();

export const pvrzWidgetState = {
  getSnapshot: (): PvrzWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: PvrzWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: PvrzWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<PvrzWidgetActions> => actions,
};
