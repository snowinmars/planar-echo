import { just, nothing } from '../maybe.js';
import { createSayId } from './common.js';

import type { Maybe } from '../maybe.js';
import type { GameLanguage } from '../gameLanguage.js';
import type { StateId } from './enums/state.js';
import type { ResponseId } from './enums/response.js';
import type {
  ArgsProps,
  InternalArgsProps,
  UntranslatedNpcDialogue,
  UntranslatedLabel,
  UntranslatedSay,
  UntranslatedResponse,
  UntranslatedJump,
} from './registerNpcDialogue.types.js';

type LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T> }>;
type SayFunction<T> = (args: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; jump: JumpFunction<T> }>;
type ResponseFunction<T> = (responseId: ResponseId, jumpTo: StateId, args: Maybe<InternalArgsProps<T>>) => Readonly<{ response: ResponseFunction<T>; flush: FlushFunction }>;
type JumpFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ flush: FlushFunction }>;
type FlushFunction = () => UntranslatedNpcDialogue;

const injectLogic = <T>(args: Maybe<InternalArgsProps<T>>, dialogueLogic: T): ArgsProps => {
  return {
    weight: args?.weight,
    onEnter: () => {
      if (args?.onEnter) args.onEnter(dialogueLogic);
    },
    onlyIf: () => {
      if (args?.onlyIf) return args.onlyIf(dialogueLogic);
      return false;
    },
  };
};

export const registerNpcDialogue = <T>(dialogueLogic: T): { label: LabelFunction<T>; expose: () => UntranslatedNpcDialogue } => {
  let _label: Maybe<UntranslatedLabel> = nothing();
  let _jumpTo: Maybe<UntranslatedJump> = nothing();
  const npcDialogue: UntranslatedNpcDialogue = {
    tree: new Map<StateId, UntranslatedLabel>(),
    constructorsWeights: new Map<StateId, number>(),
  };

  const label: LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => {
    const alreadyRegistrated = npcDialogue.tree.get(stateId);
    if (alreadyRegistrated) throw new Error(`Label ${stateId} already registrated.`);

    const hasCondition = !!args?.onlyIf;
    const hasWeight = args?.weight || args?.weight === 0;
    const hasOnlyWeight = !hasCondition && hasWeight;
    const hasOnlyCondition = hasCondition && !hasWeight;
    if (hasOnlyWeight || hasOnlyCondition) throw new Error(`To register label ${stateId} as a constructor with weight, add a onlyIf condition and optional weight to the label args`);

    const isFirstRun = !_label;
    if (!isFirstRun) {
      flush();
    }

    _label = {
      stateId: stateId,
      args: injectLogic(args, dialogueLogic),
      says: new Map<GameLanguage, UntranslatedSay[]>(),
      responses: new Map<GameLanguage, UntranslatedResponse[]>(),
      jump: nothing(),
    };

    _label.says.set('dev', []);
    _label.responses.set('dev', []);

    return {
      say,
    };
  };
  const say: SayFunction<T> = (args: Maybe<InternalArgsProps<T>>) => {
    const says = _label!.says.get('dev')!;
    says.push({
      sayId: createSayId(_label!.stateId, says.length),
      args: injectLogic(args, dialogueLogic),
    });

    return {
      say,
      response,
      jump,
    };
  };
  const response: ResponseFunction<T> = (
    responseId: string,
    jumpTo: StateId,
    args: Maybe<InternalArgsProps<T>>,
  ) => {
    _label!.responses.get('dev')!.push({
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
    const hasWeight = !!l.args?.weight;
    const weighted = hasCondition && hasWeight;
    if (weighted) npcDialogue.constructorsWeights.set(l.stateId, l.args.weight);

    return npcDialogue;
  };

  const expose = () => npcDialogue;

  return {
    label,
    expose,
  };
};
