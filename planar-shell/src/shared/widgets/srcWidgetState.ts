import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { SrcWidgetActions, SrcWidgetState } from './srcWidgetState.types';

const emptyState: SrcWidgetState = {
  loading: false,
  srcs: [],
  currentSrcId: nothing(),
};

const state$ = new BehaviorSubject<SrcWidgetState>(emptyState);

let actions: Maybe<SrcWidgetActions> = nothing();

export const srcWidgetState = {
  getSnapshot: (): SrcWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: SrcWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: SrcWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<SrcWidgetActions> => actions,
};
