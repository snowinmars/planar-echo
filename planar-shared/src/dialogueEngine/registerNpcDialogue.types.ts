import type { Maybe } from '../maybe.js';
import type { StateId } from './enums/state.js';
// import type { SoundId } from './enums/sound.js';
import type { ResponseId } from './enums/response.js';
import type { WhoId } from './enums/who.js';
import type { ItemId } from './enums/item.js';

export type EngineInstructionPlaySound = Readonly<{
  id: 'playSound';
  args: {
    sound: string; // TODO [snow]: entype as SoundId
  };
}>;

export type EngineInstruction
  = | EngineInstructionPlaySound
;
export type InternalConditionCallback<T> = (logic: T) => boolean;
export type InternalActionCallback<T> = (logic: T) => Maybe<EngineInstruction>;
export type ConditionCallback = () => boolean;
export type ActionCallback = () => Maybe<EngineInstruction>;
export type InternalArgsProps<T> = Readonly<{
  onlyIf?: Maybe<InternalConditionCallback<T>>;
  weight?: Maybe<number>;
  onEnter?: Maybe<InternalActionCallback<T>>;
}>
;
export type ArgsProps = Readonly<{
  onlyIf?: Maybe<ConditionCallback>;
  weight?: Maybe<number>;
  onEnter?: Maybe<ActionCallback>;
}>
;

export type NpcDialogue = Readonly<{
  tree: Map<StateId, DialogueLabel>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type DialogueLabel = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps>;
  says: DialogueSay[];
  responses: DialogueResponse[];
  jump: Maybe<DialogueJump>;
}>
;
export type DialogueSay = Readonly<{
  textRef: number;
  whoId: WhoId | ItemId;
  whoIdRef: number;
  sayId: string;
  args: Maybe<ArgsProps>;
}>
;
export type DialogueResponse = Readonly<{
  responseRef: Maybe<number>;
  responseId: ResponseId;
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
export type DialogueJump = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
