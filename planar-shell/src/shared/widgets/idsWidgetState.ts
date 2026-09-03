import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { IdsWidgetActions, IdsWidgetState } from './idsWidgetState.types';

const emptyState: IdsWidgetState = {
  loading: false,
  idss: [],
  currentIdsId: nothing(),
};

const state$ = new BehaviorSubject<IdsWidgetState>(emptyState);

let actions: Maybe<IdsWidgetActions> = nothing();

export const idsWidgetState = {
  getSnapshot: (): IdsWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: IdsWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: IdsWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<IdsWidgetActions> => actions,
};
