import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { BmpWidgetActions, BmpWidgetState } from './bmpWidgetState.types';

const emptyState: BmpWidgetState = {
  loading: false,
  bmps: [],
  currentBmpId: nothing(),
};

const state$ = new BehaviorSubject<BmpWidgetState>(emptyState);

let actions: Maybe<BmpWidgetActions> = nothing();

export const bmpWidgetState = {
  getSnapshot: (): BmpWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: BmpWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: BmpWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<BmpWidgetActions> => actions,
};
