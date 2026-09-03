import { BehaviorSubject } from 'rxjs';

import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { IniWidgetActions, IniWidgetState } from './iniWidgetState.types';

const emptyState: IniWidgetState = {
  loading: false,
  inis: [],
  currentIniId: nothing(),
};

const state$ = new BehaviorSubject<IniWidgetState>(emptyState);

let actions: Maybe<IniWidgetActions> = nothing();

export const iniWidgetState = {
  getSnapshot: (): IniWidgetState => state$.getValue(),
  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },
  publish: (state: IniWidgetState): void => {
    state$.next(state);
  },
  reset: (): void => {
    state$.next(emptyState);
  },
  registerActions: (next: IniWidgetActions): void => {
    actions = next;
  },
  unregisterActions: (): void => {
    actions = nothing();
  },
  getActions: (): Maybe<IniWidgetActions> => actions,
};
