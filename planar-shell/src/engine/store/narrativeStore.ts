import { create } from 'zustand';
import { initialBooleanStore, initialNumberStore, isNothing, nothing } from '@planar/shared';
import { triggerSave } from './saveSubject';

import type { UseBoundStore, StoreApi } from 'zustand';
import type { BooleanVariableId, NumberVariableId, Maybe } from '@planar/shared';
import type { EnvId } from '@planar/shared';

export type DbNarrative = Record<NumberVariableId, number> & Record<BooleanVariableId, number>;
export type ZustandNarrative = UseBoundStore<StoreApi<DbNarrative>>;
type VariableId = NumberVariableId | BooleanVariableId;

const createInitialDbNarrative = (): DbNarrative => ({
  ...initialNumberStore,
  ...initialBooleanStore,
});

export const createZustandNarrative = (initialState: Maybe<DbNarrative> = nothing()): ZustandNarrative => create<DbNarrative>()(() => initialState
  ? { ...initialState }
  : { ...createInitialDbNarrative() });

export const getNarrativeActions = (store: ZustandNarrative) => {
  const getValue = ({ variableId }: { variableId: VariableId; envId?: Maybe<EnvId> }): number => {
    // TODO [snow]: what to do with envId?
    return store.getState()[variableId];
  };

  const setValue = ({ variableId, amount }: { variableId: VariableId; envId?: Maybe<EnvId>; amount: number }): number => {
    // TODO [snow]: what to do with envId?
    store.setState({ [variableId]: amount });
    triggerSave();
    return amount;
  };

  const increment = ({ variableId, onceKey, amount }: { variableId: NumberVariableId; envId?: Maybe<EnvId>; onceKey?: Maybe<BooleanVariableId>; amount: number }): number => {
    const actual = getValue({ variableId });

    const shouldHappensOnce = !isNothing(onceKey);
    if (shouldHappensOnce) {
      const alreadyHappened = getValue({ variableId: onceKey });
      if (alreadyHappened) return actual;
      store.setState({ [onceKey]: true }); // TODO [snow]: use saveBooleanValue? Triggers...
    }

    return setValue({ variableId, amount: actual + amount });
  };

  return {
    getValue,
    setValue,
    increment,
  };
};
