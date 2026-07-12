import { create } from 'zustand';
import { nothing, Maybe } from '@planar/shared';
import { CharacterNarrativeProps } from '../constructors/types';
import { triggerSave } from './saveSubject';
import { CharacterStore, initialCharacterStore } from '../constructors/characterStore';

import type { UseBoundStore, StoreApi } from 'zustand';
import type { WhoId, StatId } from '@planar/shared';

export type DbCharacter = Record<string, CharacterNarrativeProps>;
export type ZustandCharacter = UseBoundStore<StoreApi<DbCharacter>>;

const createInitialDbCharacter = (): CharacterStore => ({
  ...initialCharacterStore,
});

export const createZustandCharacter = (initialState: Maybe<DbCharacter> = nothing()): ZustandCharacter => create<DbCharacter>()(() => initialState
  ? { ...initialState }
  : { ...createInitialDbCharacter() });

export const getCharacterActions = (store: ZustandCharacter) => ({
  getNpcStat: ({ whoId, statId }: { whoId: WhoId; statId: StatId }): number => {
    let realWhoId = whoId;
    if (whoId === 'protagonist') realWhoId = 'nameless';

    const character: CharacterNarrativeProps = store.getState()[realWhoId];
    if (!character) throw new Error(`Cannot find character '${whoId}'`);
    return character[statId];
  },

  changeNpcStat: ({ whoId, statId, amount }: { whoId: WhoId; statId: StatId; amount: number }): number => {
    let realWhoId = whoId;
    if (whoId === 'protagonist') realWhoId = 'nameless';

    const character: CharacterNarrativeProps = store.getState()[realWhoId];
    if (!character) throw new Error(`Cannot find character '${whoId}'`);
    const current = character[statId];
    const next = current + amount;
    store.setState({ [realWhoId]: { ...character, [statId]: next } });
    triggerSave();
    return next;
  },

  setNpcStat: ({ whoId, statId, amount }: { whoId: WhoId; statId: StatId; amount: number }): number => {
    let realWhoId = whoId;
    if (whoId === 'protagonist') realWhoId = 'nameless';

    const character: CharacterNarrativeProps = store.getState()[realWhoId];
    if (!character) throw new Error(`Cannot find character '${whoId}'`);
    store.setState({ [realWhoId]: { ...character, [statId]: amount } });
    triggerSave();
    return amount;
  },

  exists: (whoId: WhoId): boolean => {
    // TODO [snow]: this is wrong implementation
    return store.getState()[whoId] !== undefined;
  },
});
