import { Maybe } from "@/shared/maybe";
import { LabelId, NpcId, Sound, Sprite } from "./enums";
import { Lang } from "@/shared/lang";


export const createSayId = (labelId: LabelId, i: number) => `${labelId}_${i}`;


export type EngineInstructionPlaySound = Readonly<{
    id: 'playSound',
    args: {
        sound: Sound;
    };
}>
;
export type EngineInstructionRedraw = Readonly<{
    id: 'redraw',
    args: {
        sprite: Sprite;
    }
}>
;
export type EngineInstruction =
    | EngineInstructionPlaySound
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
    says: Map<Lang, UntranslatedSay<T>[]>;
    responses: Map<Lang, UntranslatedResponse<T>[]>;
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
    says: Map<Lang, Say<T>[]>;
    responses: Map<Lang, Response<T>[]>;
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
