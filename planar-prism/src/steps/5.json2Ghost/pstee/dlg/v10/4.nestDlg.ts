import { nothing, isNothing } from '@planar/shared';

import type { WeightedDlg } from './1.attachWeights.types.js';
import type { RawDlgResponse } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/3.parseResponses.types.js';
import type { RawDlgState } from '@/steps/4.biffs2json/pstee/dlg/v1/parsers/2.parseStates.types.js';
import type { NestedDlg, NestedDlgResponse, NestedDlgState } from './4.nestDlg.types.js';

const formTrigger = ({
  response,
  responsesTriggers,
}: Omit<NestResponseProps, 'responsesActions'>) => {
  const hasTrigger = !isNothing(response.triggerIndex) && response.triggerIndex >= 0;
  if (!hasTrigger) return nothing();
  const trigger = responsesTriggers.get(response.triggerIndex)!;
  return { index: trigger.index, text: trigger.text };
};
const formAction = ({
  response,
  responsesActions,
}: Omit<NestResponseProps, 'responsesTriggers'>) => {
  const hasTrigger = !isNothing(response.actionIndex) && response.actionIndex >= 0;
  if (!hasTrigger) return nothing();
  const trigger = responsesActions.get(response.actionIndex)!;
  return { index: trigger.index, text: trigger.text };
};

type NestResponseProps = Pick<WeightedDlg, 'responsesTriggers' | 'responsesActions'> & Readonly<{
  response: WeightedDlg['responses'][number];
}>;
const nestResponse = ({
  response,
  responsesTriggers,
  responsesActions,
}: NestResponseProps): NestedDlgResponse => {
  const trigger = formTrigger({ response, responsesTriggers });
  const action = formAction({ response, responsesActions });

  return {
    index: response.index,
    flags: response.flags,
    nextDlg: response.nextDlg,
    nextDlgState: response.nextDlgState,
    textRef: response.textRef,
    journalRef: response.journalRef,
    trigger,
    action,
  };
};

type NestStateProps = Pick<WeightedDlg, 'responses' | 'stateTriggers' | 'responsesTriggers' | 'responsesActions'> & Readonly<{
  state: WeightedDlg['states'][number];
}>;
const nestState = ({
  state,
  responses,
  stateTriggers,
  responsesTriggers,
  responsesActions,
}: NestStateProps): NestedDlgState => {
  const _responses = responses
    .slice(state.firstResponseIndex, state.firstResponseIndex + state.responsesCount)
    .map((r: RawDlgResponse) => nestResponse({
      response: r,
      responsesTriggers,
      responsesActions,
    }));

  const hasTrigger = !isNothing(state.triggerIndex) && state.triggerIndex >= 0;
  const trigger = hasTrigger ? stateTriggers.get(state.triggerIndex)! : nothing();
  return {
    index: state.index,
    trigger,
    action: nothing(),
    responses: _responses,
    textRef: state.textRef,
  };
};

export const nestDlg = (dlg: WeightedDlg): NestedDlg => {
  const nestedStates = dlg.states
    .map((state: RawDlgState) => nestState({
      state: state,
      responses: dlg.responses,
      stateTriggers: dlg.stateTriggers,
      responsesTriggers: dlg.responsesTriggers,
      responsesActions: dlg.responsesActions,
    }));

  return {
    resourceName: dlg.resourceName,
    header: dlg.header,
    stateIndicesOrderedByWeight: dlg.stateIndicesOrderedByWeight,
    states: nestedStates,
  };
};

export default nestDlg;
