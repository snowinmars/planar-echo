// import { just } from '@planar/shared';
import { createSayId, just } from './_types.js';

// import type { Maybe, GameLanguage } from '@planar/shared';
import type { StateId, ResponseId } from './enums.js';
import type {
  Maybe,
  GameLanguage,
  ArgsProps,
  UntranslatedNpcDialogue,
  UntranslatedLabel,
  UntranslatedSay,
  UntranslatedResponse,
  UntranslatedJump,
} from './_types.js';

type LabelFunction<T> = (stateId: StateId, args?: Maybe<ArgsProps<T>>) => Readonly<{ say: SayFunction<T> }>;
type SayFunction<T> = (args: Maybe<ArgsProps<T>>) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; jump: JumpFunction<T> }>;
type ResponseFunction<T> = (responseId: ResponseId, jumpTo: StateId, args: Maybe<ArgsProps<T>>) => Readonly<{ response: ResponseFunction<T>; label: LabelFunction<T>; done: DoneFunction<T> }>;
type JumpFunction<T> = (stateId: StateId, args?: Maybe<ArgsProps<T>>) => Readonly<{ label: LabelFunction<T>; done: DoneFunction<T> }>;
type DoneFunction<T> = () => UntranslatedNpcDialogue<T>;

const registerNpcDialogue = <T>(): { label: LabelFunction<T> } => {
  let _label: Maybe<UntranslatedLabel<T>> = null;
  let _jumpTo: Maybe<UntranslatedJump<T>> = null;
  const npcDialogue: UntranslatedNpcDialogue<T> = {
    tree: new Map<StateId, UntranslatedLabel<T>>(),
    constructorsWeights: new Map<StateId, number>(),
  };

  const label: LabelFunction<T> = (stateId: StateId, args?: Maybe<ArgsProps<T>>) => {
    const alreadyRegistrated = npcDialogue.tree.get(stateId);
    if (alreadyRegistrated) throw new Error(`Label ${stateId} already registrated.`);

    const hasCondition = !!args?.onlyIf;
    const hasWeight = args?.weight || args?.weight === 0;
    const hasOnlyWeight = !hasCondition && hasWeight;
    const hasOnlyCondition = hasCondition && !hasWeight;
    if (hasOnlyWeight || hasOnlyCondition) throw new Error(`To register label ${stateId} as a constructor with weight, add a onlyIf condition and optional weight to the label args`);

    const isFirstRun = !_label;
    if (!isFirstRun) {
      done();
    }

    _label = {
      stateId: stateId,
      args: args,
      says: new Map<GameLanguage, UntranslatedSay<T>[]>(),
      responses: new Map<GameLanguage, UntranslatedResponse<T>[]>(),
      jump: null,
    };

    _label.says.set('dev', []);
    _label.responses.set('dev', []);

    return {
      say,
    };
  };
  const say: SayFunction<T> = (args: Maybe<ArgsProps<T>>) => {
    const s = _label!.says.get('dev')!;
    s.push({
      sayId: createSayId(_label!.stateId, s.length),
      args,
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
    args: Maybe<ArgsProps<T>>,
  ) => {
    _label!.responses.get('dev')!.push({
      responseId,
      jumpTo,
      args,
    });

    return {
      response,
      label,
      done,
    };
  };
  const jump: JumpFunction<T> = (jumpTo: StateId, args?: Maybe<ArgsProps<T>>) => {
    _jumpTo = {
      jumpTo,
      args,
    };
    return {
      label,
      done,
    };
  };
  const done: DoneFunction<T> = () => {
    /*
         * builer guarantees that:
         * - stateId is set
         * - at least one SayItem is set
         * - at least one responseItem or JumpItem is set
         */
    const l = just(_label);
    npcDialogue.tree.set(l.stateId, {
      stateId: l.stateId,
      args: l.args,
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

  return {
    label,
  };
};

export default registerNpcDialogue;
