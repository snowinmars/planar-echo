import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { BcsWidgetActions, BcsWidgetState } from './bcsWidgetState.types';

const emptyState: BcsWidgetState = {
  loading: false,
  bcss: [],
  currentBcsId: nothing(),
};

const state$ = new BehaviorSubject<BcsWidgetState>(emptyState);

let actions: Maybe<BcsWidgetActions> = nothing();

export const bcsWidgetState = {
  getSnapshot: (): BcsWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: BcsWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: BcsWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<BcsWidgetActions> => actions,
};
