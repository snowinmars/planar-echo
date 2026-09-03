import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { TwodaWidgetActions, TwodaWidgetState } from './twodaWidgetState.types';

const emptyState: TwodaWidgetState = {
  loading: false,
  twodas: [],
  currentTwodaId: nothing(),
};

const state$ = new BehaviorSubject<TwodaWidgetState>(emptyState);

let actions: Maybe<TwodaWidgetActions> = nothing();

export const twodaWidgetState = {
  getSnapshot: (): TwodaWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: TwodaWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: TwodaWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<TwodaWidgetActions> => actions,
};
