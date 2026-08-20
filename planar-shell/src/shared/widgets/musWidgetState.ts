import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { MusWidgetActions, MusWidgetState } from './musWidgetState.types';

const emptyState: MusWidgetState = {
  loading: false,
  muss: [],
  currentMusId: nothing(),
};

const state$ = new BehaviorSubject<MusWidgetState>(emptyState);

let actions: Maybe<MusWidgetActions> = nothing();

export const musWidgetState = {
  getSnapshot: (): MusWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: MusWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: MusWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<MusWidgetActions> => actions,
};
