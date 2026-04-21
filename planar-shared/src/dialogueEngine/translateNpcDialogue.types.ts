import type { Maybe } from '../maybe.js';
import type { ResponseId } from './enums/response.js';
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
  sayId: string; // TODO [snow]: to SayId
  whoId: WhoId;
  what: string;
  args: Maybe<ArgsProps>;
}>
;
export type Response = Readonly<{
  responseId: ResponseId;
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
