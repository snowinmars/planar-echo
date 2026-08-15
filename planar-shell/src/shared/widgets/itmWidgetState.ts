import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { ItmWidgetActions, ItmWidgetState } from './itmWidgetState.types';

const emptyState: ItmWidgetState = {
  loading: false,
  itms: [],
  currentItmId: nothing(),
};

const state$ = new BehaviorSubject<ItmWidgetState>(emptyState);

let actions: Maybe<ItmWidgetActions> = nothing();

export const itmWidgetState = {
  getSnapshot: (): ItmWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: ItmWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: ItmWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<ItmWidgetActions> => actions,
};
