import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { BamWidgetActions, BamWidgetState } from './bamWidgetState.types';

const emptyState: BamWidgetState = {
  loading: false,
  bams: [],
  currentBamId: nothing(),
};

const state$ = new BehaviorSubject<BamWidgetState>(emptyState);

let actions: Maybe<BamWidgetActions> = nothing();

export const bamWidgetState = {
  getSnapshot: (): BamWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: BamWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: BamWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<BamWidgetActions> => actions,
};
