import type { LabelId, NpcId, Sound, Sprite } from './_enums.js';

export const createSayId = (labelId: LabelId, i: number) => `${labelId}_${i}`;
export type DevGameLanguage = GameLanguage | 'dev';

export type EngineInstructionPlaySound = Readonly<{
  id: 'playSound';
  args: {
    sound: Sound;
  };
}>
;
export type EngineInstructionRedraw = Readonly<{
  id: 'redraw';
  args: {
    sprite: Sprite;
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
  tree: Map<LabelId, UntranslatedLabel<T>>;
  constructorsWeights: Map<LabelId, number>;
}>
;
export type UntranslatedLabel<T> = Readonly<{
  labelId: LabelId;
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
  jumpTo: LabelId;
  args: Maybe<ArgsProps<T>>;
}>
;
export type UntranslatedJump<T> = Readonly<{
  jumpTo: LabelId;
  args: Maybe<ArgsProps<T>>;
}>
;

export type NpcDialogue<T> = Readonly<{
  tree: Map<LabelId, Label<T>>;
  constructorsWeights: Map<LabelId, number>;
}>
;
export type Label<T> = Readonly<{
  labelId: LabelId;
  args: Maybe<ArgsProps<T>>;
  says: Map<DevGameLanguage, Say<T>[]>;
  responses: Map<DevGameLanguage, Response<T>[]>;
  jump: Maybe<Jump<T>>;
}>
;
export type Say<T> = Readonly<{
  sayId: string;
  who: NpcId;
  what: string;
  args: Maybe<ArgsProps<T>>;
}>
;
export type Response<T> = Readonly<{
  responseId: string;
  jumpTo: LabelId;
  what: string;
  args: Maybe<ArgsProps<T>>;
}>
;
export type Jump<T> = Readonly<{
  jumpTo: LabelId;
  args: Maybe<ArgsProps<T>>;
}>
;

///

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
