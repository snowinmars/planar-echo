import { create } from 'zustand';
import { isNothing } from '@planar/shared';
import { triggerSave } from './saveSubject';

import type { UseBoundStore, StoreApi } from 'zustand';
import type { BooleanVariableId, NumberVariableId, Maybe } from '@planar/shared';
import type { EnvId, KeyId, VariableId } from '@planar/shared';

export type DbNarrative = Record<NumberVariableId, number> & Record<BooleanVariableId, number> & Record<KeyId, number>;
export type ZustandNarrative = UseBoundStore<StoreApi<DbNarrative>>;

export const createZustandNarrative = (initialState: DbNarrative): ZustandNarrative => create<DbNarrative>()(() => initialState);

export const getNarrativeActions = (store: ZustandNarrative) => {
  const getValue = ({ variableId }: { variableId: VariableId | KeyId; envId?: Maybe<EnvId> }): number => {
    // TODO [snow]: what to do with envId?
    return store.getState()[variableId];
  };

  const setValue = ({ variableId, amount }: { variableId: VariableId; envId?: Maybe<EnvId>; amount: number }): number => {
    // TODO [snow]: what to do with envId?
    store.setState({ [variableId]: amount });
    triggerSave();
    return amount;
  };

  const increment = ({ variableId, onceKey, amount }: { variableId: NumberVariableId; envId?: Maybe<EnvId>; onceKey?: Maybe<KeyId>; amount: number }): number => {
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
