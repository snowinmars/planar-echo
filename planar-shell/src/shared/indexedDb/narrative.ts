import { getWorldState, setWorldState } from './crud';

import type { WorldStateItem } from './crud';
import type { Maybe, NumberVariableId, BooleanVariableId, KeyId } from '@planar/shared';

export type NarrativeState = Record<NumberVariableId, number> & Record<BooleanVariableId, number> & Record<KeyId, number>;

const storeName = 'narrative';
const worldId = '0';

export const getDbNarrative = (): Promise<Maybe<WorldStateItem<NarrativeState>>> => getWorldState<NarrativeState>(storeName, worldId);
export const setDbNarrative = (state: NarrativeState): Promise<void> => setWorldState(storeName, worldId, state);
