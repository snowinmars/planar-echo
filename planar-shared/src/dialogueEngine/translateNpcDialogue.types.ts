import type { Maybe } from '../maybe.js';
import type { StateId } from './enums/state.js';
import type { WhoId } from './enums/who.js';
import type { ArgsProps, DevGameLanguage } from './registerNpcDialogue.types.js';

export type NpcDialogue = Readonly<{
  tree: Map<StateId, Label>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type Label = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps>;
  says: Map<DevGameLanguage, Say[]>;
  responses: Map<DevGameLanguage, Response[]>;
  jump: Maybe<Jump>;
}>
;
export type Say = Readonly<{
  sayId: string;
  whoId: WhoId;
  what: string;
  args: Maybe<ArgsProps>;
}>
;
export type Response = Readonly<{
  responseId: string;
  jumpTo: StateId;
  what: string;
  args: Maybe<ArgsProps>;
}>
;
export type Jump = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
