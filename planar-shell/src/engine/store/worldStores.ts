import { nothing, type Maybe } from '@planar/shared';
import type { ZustandNarrative } from './narrativeStore';
import type { ZustandCharacter } from './characterStore';

let _zustandNarrative: Maybe<ZustandNarrative> = nothing();
let _zustandCharacter: Maybe<ZustandCharacter> = nothing();

export const getZustandNarrative = (): Maybe<ZustandNarrative> => _zustandNarrative;
export const setZustandNarrative = (zustandNarrative: ZustandNarrative): ZustandNarrative => _zustandNarrative = zustandNarrative;

export const getZustandCharacter = (): Maybe<ZustandCharacter> => _zustandCharacter;
export const setZustandCharacter = (zustandCharacter: ZustandCharacter): ZustandCharacter => _zustandCharacter = zustandCharacter;
