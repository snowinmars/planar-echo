import type {
  StateId,
  WhoId,
  SoundId,
  SpriteId,
} from './enums.js';

export const createSayId = (stateId: StateId, i: number) => `${stateId}_${i}`;
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
export type ConditionCallback<T> = (logic: T) => boolean
;
export type ActionCallback<T> = (logic: T) => Maybe<EngineInstruction>
;
export type ArgsProps<T> = Readonly<{
  onlyIf?: Maybe<ConditionCallback<T>>;
  weight?: Maybe<number>;
  onEnter?: Maybe<ActionCallback<T>>;
}>
;

export type UntranslatedNpcDialogue<T> = Readonly<{
  tree: Map<StateId, UntranslatedLabel<T>>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type UntranslatedLabel<T> = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps<T>>;
  says: Map<DevGameLanguage, UntranslatedSay<T>[]>;
  responses: Map<DevGameLanguage, UntranslatedResponse<T>[]>;
  jump: Maybe<UntranslatedJump<T>>;
}>
;
export type UntranslatedSay<T> = Readonly<{
  sayId: string;
  args: Maybe<ArgsProps<T>>;
}>
;
export type UntranslatedResponse<T> = Readonly<{
  responseId: string;
  jumpTo: StateId;
  args: Maybe<ArgsProps<T>>;
}>
;
export type UntranslatedJump<T> = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps<T>>;
}>
;

export type NpcDialogue<T> = Readonly<{
  tree: Map<StateId, Label<T>>;
  constructorsWeights: Map<StateId, number>;
}>
;
export type Label<T> = Readonly<{
  stateId: StateId;
  args: Maybe<ArgsProps<T>>;
  says: Map<DevGameLanguage, Say<T>[]>;
  responses: Map<DevGameLanguage, Response<T>[]>;
  jump: Maybe<Jump<T>>;
}>
;
export type Say<T> = Readonly<{
  sayId: string;
  whoId: WhoId;
  what: string;
  args: Maybe<ArgsProps<T>>;
}>
;
export type Response<T> = Readonly<{
  responseId: string;
  jumpTo: StateId;
  what: string;
  args: Maybe<ArgsProps<T>>;
}>
;
export type Jump<T> = Readonly<{
  jumpTo: StateId;
  args: Maybe<ArgsProps<T>>;
}>
;

/* this files copies as is to the ghost directory,
 * and I do not want the ghost directory to be npm package for now,
 * so I manually insert dependencies in this block
 */

export type GameLanguage
  = | 'cs_CZ'
    | 'de_DE'
    | 'en_US'
    | 'fr_FR'
    | 'ko_KR'
    | 'pl_PL'
    | 'ru_RU'
;

export type Nothing = null | undefined | void;
export type Maybe<T> = NonNullable<T> | Nothing;
export const just = <T>(maybe: Maybe<T>): T => {
  if (maybe || maybe === 0 || maybe === '') return maybe;
  throw new Error('Null reference exception');
};
export const maybe = <T>(value: T): Maybe<T> => value ?? null;
export const nothing = (): Nothing => undefined;
