import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { WavWidgetActions, WavWidgetState } from './wavWidgetState.types';

const emptyState: WavWidgetState = {
  loading: false,
  wavs: [],
  currentWavId: nothing(),
};

const state$ = new BehaviorSubject<WavWidgetState>(emptyState);

let actions: Maybe<WavWidgetActions> = nothing();

export const wavWidgetState = {
  getSnapshot: (): WavWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: WavWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: WavWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<WavWidgetActions> => actions,
};
