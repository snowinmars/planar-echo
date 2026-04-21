import type { GameLanguage } from '../gameLanguage.js';
import type { Maybe } from '../maybe.js';
import type { StateId } from './enums/state.js';
import type { SoundId } from './enums/sound.js';
import type { SpriteId } from './enums/sprite.js';
import type { ResponseId } from './enums/response.js';

export type DevGameLanguage = GameLanguage | 'dev';

export type EngineInstructionPlaySound = Readonly<{
  id: 'playSound';
  args: {
    sound: SoundId;
  };
}>
;
export type EngineInstructionRedraw = Readonly<{
  id: 'redraw';
  args: {
    sprite: SpriteId;
  };
}>
;
export type EngineInstruction
  = | EngineInstructionPlaySound
    | EngineInstructionRedraw
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

export type UntranslatedNpcDialogue = Readonly<{
  tree: Map<StateId, UntranslatedLabel>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type UntranslatedLabel = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps>;
  says: Map<DevGameLanguage, UntranslatedSay[]>;
  responses: Map<DevGameLanguage, UntranslatedResponse[]>;
  jump: Maybe<UntranslatedJump>;
}>
;
export type UntranslatedSay = Readonly<{
  sayId: string;
  args: Maybe<ArgsProps>;
}>
;
export type UntranslatedResponse = Readonly<{
  responseId: ResponseId;
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
export type UntranslatedJump = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps>;
}>
;
