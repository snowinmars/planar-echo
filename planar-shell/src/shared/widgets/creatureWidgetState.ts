import { BehaviorSubject } from 'rxjs';
import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { CreatureWidgetActions, CreatureWidgetState } from './creatureWidgetState.types';

const emptyState: CreatureWidgetState = {
  loading: false,
  creatures: [],
  currentCreatureId: '',
};

const state$ = new BehaviorSubject<CreatureWidgetState>(emptyState);

let actions: Maybe<CreatureWidgetActions> = nothing();

export const creatureWidgetState = {
  getSnapshot: (): CreatureWidgetState => state$.getValue(),

  subscribe: (onStoreChange: () => void): (() => void) => {
    const subscription = state$.subscribe(() => onStoreChange());
    return () => subscription.unsubscribe();
  },

  publish: (state: CreatureWidgetState): void => {
    state$.next(state);
  },

  reset: (): void => {
    state$.next(emptyState);
  },

  registerActions: (next: CreatureWidgetActions): void => {
    actions = next;
  },

  unregisterActions: (): void => {
    actions = nothing();
  },

  getActions: (): Maybe<CreatureWidgetActions> => actions,
};
