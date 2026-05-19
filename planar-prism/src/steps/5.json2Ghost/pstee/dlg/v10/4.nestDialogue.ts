import { nothing, isNothing } from '@planar/shared';

import type { SplittedState, SplittedDlg } from './3.splitTranslation.types.js';
import type { TlkedResponse } from './2.patchTranslation.types.js';
import type { NestedDlg, NestedDlgResponse, NestedDlgState } from './4.nestDialogue.types.js';

const formTrigger = ({
  response,
  responsesTriggers,
}: Omit<NestResponseProps, 'responsesActions'>) => {
  const hasTrigger = !isNothing(response.triggerIndex) && response.triggerIndex! >= 0;
  if (!hasTrigger) return nothing();
  const trigger = responsesTriggers.get(response.triggerIndex!)!;
  return { index: trigger.index, text: trigger.text };
};
const formAction = ({
  response,
  responsesActions,
}: Omit<NestResponseProps, 'responsesTriggers'>) => {
  const hasTrigger = !isNothing(response.actionIndex) && response.actionIndex! >= 0;
  if (!hasTrigger) return nothing();
  const trigger = responsesActions.get(response.actionIndex!)!;
  return { index: trigger.index, text: trigger.text };
};

type NestResponseProps = Pick<SplittedDlg, 'responsesTriggers' | 'responsesActions'> & Readonly<{
  response: SplittedDlg['responses'][number];
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
    nextDialog: response.nextDialog,
    nextDialogState: response.nextDialogState,
    textTlk: response.textTlk,
    journalId: response.journalRef,
    journalTlk: response.journalTlk,
    trigger,
    action,
  };
};

type NestStateProps = Pick<SplittedDlg, 'responses' | 'stateTriggers' | 'responsesTriggers' | 'responsesActions'> & Readonly<{
  state: SplittedDlg['states'][number];
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
    .map((r: TlkedResponse) => nestResponse({
      response: r,
      responsesTriggers,
      responsesActions,
    }));

  const hasTrigger = state.triggerIndex && state.triggerIndex >= 0;
  const trigger = hasTrigger ? stateTriggers.get(state.triggerIndex)! : nothing();
  return {
    index: state.index,
    trigger,
    action: state.action,
    responses: _responses,
    textTlk: state.textTlk,
  };
};

export const nestDialogue = (dlg: SplittedDlg): NestedDlg => {
  const nestedStates = dlg.states
    .map((state: SplittedState) => nestState({
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

export default nestDialogue;
