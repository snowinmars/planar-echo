import { getWorldState, setWorldState } from './crud';

import type { WorldStateItem } from './crud';
import type { CharacterNarrativeProps, Maybe } from '@planar/shared';

export type CharactersState = Record<string, CharacterNarrativeProps>;

const storeName = 'characters';
const worldId = '0';

export const getDbCharacters = (): Promise<Maybe<WorldStateItem<CharactersState>>> => getWorldState<CharactersState>(storeName, worldId);
export const setDbCharacters = (state: CharactersState): Promise<void> => setWorldState(storeName, worldId, state);
