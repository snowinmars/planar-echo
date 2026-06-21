import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { ItemWidgetActions, ItemWidgetState } from './itemWidgetState.types';

const emptyState: ItemWidgetState = {
  loading: false,
  items: [],
  currentItemId: '',
};

const state$ = new BehaviorSubject<ItemWidgetState>(emptyState);

let actions: Maybe<ItemWidgetActions> = nothing();

export const itemWidgetState = {
  getSnapshot: (): ItemWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: ItemWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: ItemWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<ItemWidgetActions> => actions,
};
