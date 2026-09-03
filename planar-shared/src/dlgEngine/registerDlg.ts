import { just, nothing } from '../maybe.js';

import type {
  GhostDlg,
  GhostDlgArgs,
  GhostDlgJump,
  GhostDlgLabel,
} from '../ghost/dlg.types.js';
import type { Maybe } from '../maybe.js';
import type { ItmId } from './enums/itm.js';
import type { ResponseId } from './enums/response.js';
import type { StateId } from './enums/state.js';
import type { WhoId } from './enums/who.js';
import type { InternalArgsProps } from './registerDlg.types.js';

type LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T> }>;
type SayFunction<T> = (whoId: WhoId | ItmId, whoIdRef: number, textRef: number, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ say: SayFunction<T>; response: ResponseFunction<T>; jump: JumpFunction<T> }>;
type ResponseFunction<T> = (responseRef: Maybe<number>, responseId: ResponseId, jumpTo: StateId, args: Maybe<InternalArgsProps<T>>) => Readonly<{ response: ResponseFunction<T>; flush: FlushFunction }>;
type JumpFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => Readonly<{ flush: FlushFunction }>;
type FlushFunction = () => GhostDlg;

const createSayId = (stateId: StateId, i: number) => `${stateId}_${i}`;
const injectLogic = <T>(args: Maybe<InternalArgsProps<T>>, dlgLogic: T): GhostDlgArgs => {
  return {
    weight: args?.weight,
    onEnter: args?.onEnter ? () => args.onEnter!(dlgLogic) : null,
    onlyIf: args?.onlyIf ? () => args.onlyIf!(dlgLogic) : null,
  };
};

export const registerDlg = <T>(resourceName: string, dlgLogic: T): { label: LabelFunction<T>; expose: () => GhostDlg } => {
  let _label: Maybe<GhostDlgLabel> = nothing();
  let _jumpTo: Maybe<GhostDlgJump> = nothing();
  let exposed = false;
  const npcDlg: GhostDlg = {
    resourceName,
    tree: new Map<StateId, GhostDlgLabel>(),
    constructorsWeights: new Map<StateId, number>(),
  };

  const label: LabelFunction<T> = (stateId: StateId, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dlg was already exposed`);

    const alreadyRegistrated = npcDlg.tree.get(stateId);
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
      args: injectLogic(args, dlgLogic),
      says: [],
      responses: [],
      jump: nothing(),
    };

    return {
      say,
    };
  };
  const say: SayFunction<T> = (whoId: WhoId | ItmId, whoIdRef: number, textRef: number, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dlg was already exposed`);

    const says = _label!.says;
    says.push({
      sayId: createSayId(_label!.stateId, says.length),
      whoId,
      whoIdRef,
      textRef,
      args: injectLogic(args, dlgLogic),
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
    if (exposed) throw new Error(`Result dlg was already exposed`);

    _label!.responses.push({
      responseRef,
      responseId,
      jumpTo,
      args: injectLogic(args, dlgLogic),
    });

    return {
      response,
      // label,
      flush,
    };
  };
  const jump: JumpFunction<T> = (jumpTo: StateId, args?: Maybe<InternalArgsProps<T>>) => {
    if (exposed) throw new Error(`Result dlg was already exposed`);

    _jumpTo = {
      jumpTo,
      args: injectLogic(args, dlgLogic),
    };
    return {
      // label,
      flush,
    };
  };
  const flush: FlushFunction = () => {
    if (exposed) throw new Error(`Result dlg was already exposed`);

    /*
     * builer guarantees that:
     * - stateId is set
     * - at least one SayItem is set
     * - at least one responseItem or JumpItem is set
     */
    const l = just(_label);
    npcDlg.tree.set(l.stateId, {
      stateId: l.stateId,
      args: injectLogic(l.args, dlgLogic),
      says: l.says,
      responses: l.responses,
      jump: _jumpTo,
    });

    const hasCondition = !!l.args?.onlyIf;
    const hasWeight = !!l.args?.weight || l.args?.weight === 0;
    const weighted = hasCondition && hasWeight;
    if (weighted) npcDlg.constructorsWeights.set(l.stateId, l.args.weight);

    return npcDlg;
  };

  const expose = () => {
    exposed = true;
    return npcDlg;
  };

  return {
    label,
    expose,
  };
};
