import { just, nothing } from '../maybe.js';
import { createSayId } from './common.js';

import type { Maybe } from '../maybe.js';
import type { StateId } from './enums/state.js';
import type { ResponseId } from './enums/response.js';
import type { WhoId } from './enums/who.js';
import type { ItemId } from './enums/item.js';
import type {
  ArgsProps,
  InternalArgsProps,
  NpcDialogue,
  DialogueLabel,
  DialogueJump,
} from './registerNpcDialogue.types.js';

type LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T> }>;
type SayFunction<T> = (whoId: WhoId | ItemId, whoIdRef: number, textRef: number, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; jump: JumpFunction<T> }>;
type ResponseFunction<T> = (responseRef: Maybe<number>, responseId: ResponseId, jumpTo: StateId, args: Maybe<InternalArgsProps<T>>) => Readonly<{ response: ResponseFunction<T>; flush: FlushFunction }>;
type JumpFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ flush: FlushFunction }>;
type FlushFunction = () => NpcDialogue;

const injectLogic = <T>(args: Maybe<InternalArgsProps<T>>, dialogueLogic: T): ArgsProps => {
  return {
    weight: args?.weight,
    onEnter: args?.onEnter ? () => args.onEnter!(dialogueLogic) : null,
    onlyIf: args?.onlyIf ? () => args.onlyIf!(dialogueLogic) : null,
  };
};

export const registerNpcDialogue = <T>(dialogueLogic: T): { label: LabelFunction<T>; expose: () => NpcDialogue } => {
  let _label: Maybe<DialogueLabel> = nothing();
  let _jumpTo: Maybe<DialogueJump> = nothing();
  let exposed = false;
  const npcDialogue: NpcDialogue = {
    tree: new Map<StateId, DialogueLabel>(),
    constructorsWeights: new Map<StateId, number>(),
  };

  const label: LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dialogue was already exposed`);

    const alreadyRegistrated = npcDialogue.tree.get(stateId);
    if (alreadyRegistrated) throw new Error(`Label '${stateId}' already registered.`);

    const hasCondition = !!args?.onlyIf;
    const hasWeight = !!args?.weight || args?.weight === 0;
    const hasOnlyWeight = !hasCondition && hasWeight;
    const hasOnlyCondition = hasCondition && !hasWeight;
    if (hasOnlyWeight || hasOnlyCondition) throw new Error(`To register label '${stateId}' as a constructor with weight, add a onlyIf condition and optional weight to the label args`);

    const isFirstRun = !_label;
    if (!isFirstRun) {
      flush();
    }

    _label = {
      stateId: stateId,
      args: injectLogic(args, dialogueLogic),
      says: [],
      responses: [],
      jump: nothing(),
    };

    return {
      say,
    };
  };
  const say: SayFunction<T> = (whoId: WhoId | ItemId, whoIdRef: number, textRef: number, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dialogue was already exposed`);

    const says = _label!.says;
    says.push({
      sayId: createSayId(_label!.stateId, says.length),
      whoId,
      whoIdRef,
      textRef,
      args: injectLogic(args, dialogueLogic),
    });

    return {
      say,
      response,
      jump,
    };
  };
  const response: ResponseFunction<T> = (
    responseRef: Maybe<number>,
    responseId: ResponseId,
    jumpTo: StateId,
    args: Maybe<InternalArgsProps<T>>,
  ) => {
    if (exposed) throw new Error(`Result dialogue was already exposed`);

    _label!.responses.push({
      responseRef,
      responseId,
      jumpTo,
      args: injectLogic(args, dialogueLogic),
    });

    return {
      response,
      // label,
      flush,
    };
  };
  const jump: JumpFunction<T> = (jumpTo: StateId, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dialogue was already exposed`);

    _jumpTo = {
      jumpTo,
      args: injectLogic(args, dialogueLogic),
    };
    return {
      // label,
      flush,
    };
  };
  const flush: FlushFunction = () => {
    if (exposed) throw new Error(`Result dialogue was already exposed`);

    /*
     * builer guarantees that:
     * - stateId is set
     * - at least one SayItem is set
     * - at least one responseItem or JumpItem is set
     */
    const l = just(_label);
    npcDialogue.tree.set(l.stateId, {
      stateId: l.stateId,
      args: injectLogic(l.args, dialogueLogic),
      says: l.says,
      responses: l.responses,
      jump: _jumpTo,
    });

    const hasCondition = !!l.args?.onlyIf;
    const hasWeight = !!l.args?.weight || l.args?.weight === 0;
    const weighted = hasCondition && hasWeight;
    if (weighted) npcDialogue.constructorsWeights.set(l.stateId, l.args.weight);

    return npcDialogue;
  };

  const expose = () => {
    exposed = true;
    return npcDialogue;
  };

  return {
    label,
    expose,
  };
};
