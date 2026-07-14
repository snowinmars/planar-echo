import type { Maybe } from '../maybe.js';
import type { ItemId } from './enums/item.js';
import type { ResponseId } from './enums/response.js';
import type { StateId } from './enums/state.js';
import type { WhoId } from './enums/who.js';
import type { ArgsProps, DevGameLanguage } from './registerNpcDialogue.types.js';

export type TranslatedNpcDialogue = Readonly<{
  tree: Map<StateId, TranslatedLabel>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type TranslatedLabel = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps>;
  says: Map<DevGameLanguage, TranslatedSay[]>;
  responses: Map<DevGameLanguage, TranslatedResponse[]>;
  jump: Maybe<TranslatedJump>;
}>
;
export type TranslatedSay = Readonly<{
  sayId: string; // TODO [snow]: to SayId
  whoIdOrItemId: WhoId | ItemId;
  localizedName: string;
  what: string;
  args: Maybe<ArgsProps>;
}>
;
export type TranslatedResponse = Readonly<{
  responseId: ResponseId;
  jumpTo: StateId;
  what: string;
  args: Maybe<ArgsProps>;
}>
;
export type TranslatedJump = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
