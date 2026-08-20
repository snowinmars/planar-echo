import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { AcmWidgetActions, AcmWidgetState } from './acmWidgetState.types';

const emptyState: AcmWidgetState = {
  loading: false,
  acms: [],
  currentAcmId: nothing(),
};

const state$ = new BehaviorSubject<AcmWidgetState>(emptyState);

let actions: Maybe<AcmWidgetActions> = nothing();

export const acmWidgetState = {
  getSnapshot: (): AcmWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: AcmWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: AcmWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<AcmWidgetActions> => actions,
};
