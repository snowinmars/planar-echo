import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { DlgWidgetActions, DlgWidgetState } from './dlgWidgetState.types';

const emptyState: DlgWidgetState = {
  loading: false,
  dlgs: [],
  tree: nothing(),
  currentDlgId: nothing(),
  currentStateId: nothing(),
};

const state$ = new BehaviorSubject<DlgWidgetState>(emptyState);

let actions: Maybe<DlgWidgetActions> = nothing();

export const dlgWidgetState = {
  getSnapshot: (): DlgWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: DlgWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: DlgWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<DlgWidgetActions> => actions,
};
