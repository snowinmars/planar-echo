import { nothing } from '@planar/shared';
import type { GhostDlg, GhostDlgResponse, GhostDlgState, TlkedDlg, TlkedResponse, TlkedState } from './types.js';

type NestResponseProps = Readonly<{
  response: TlkedDlg['responses'][number];
  responsesTriggers: TlkedDlg['responsesTriggers'];
  responsesActions: TlkedDlg['responsesActions'];
}>;
const nestResponse = ({
  response,
  responsesTriggers,
  responsesActions,
}: NestResponseProps): GhostDlgResponse => {
  const hasTrigger = response.triggerIndex && response.triggerIndex >= 0;
  const trigger = hasTrigger ? responsesTriggers.get(response.triggerIndex) : nothing();

  const hasAction = response.actionIndex && response.actionIndex >= 0;
  const action = hasAction ? responsesActions.get(response.actionIndex) : nothing();

  return {
    index: response.index,
    flags: response.flags,
    textRef: response.textRef,
    journalRef: response.journalRef,
    trigger,
    action,
    nextDialog: response.nextDialog,
    nextDialogState: response.nextDialogState,
    textTlk: response.textTlk,
    journalTlk: response.journalTlk,
  };
};

type NestStateProps = Readonly<{
  state: TlkedDlg['states'][number];
  responses: TlkedDlg['responses'];
  stateTriggers: TlkedDlg['stateTriggers'];
  responsesTriggers: TlkedDlg['responsesTriggers'];
  responsesActions: TlkedDlg['responsesActions'];
}>;
const nestState = ({
  state,
  responses,
  stateTriggers,
  responsesTriggers,
  responsesActions,
}: NestStateProps): GhostDlgState => {
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
    textRef: state.textRef,
    trigger,
    action: nothing(), // sets later in zero patch
    responses: _responses,
    textTlk: state.textTlk,
  };
};

export const nestDialogue = (dialogue: TlkedDlg): GhostDlg => {
  const nestedStates = dialogue.states
    .map((state: TlkedState) => nestState({
      state: state,
      responses: dialogue.responses,
      stateTriggers: dialogue.stateTriggers,
      responsesTriggers: dialogue.responsesTriggers,
      responsesActions: dialogue.responsesActions,
    }));

  return {
    resourceName: dialogue.resourceName,
    header: dialogue.header,
    states: nestedStates,
    stateIndicesOrderedByWeight: dialogue.stateIndicesOrderedByWeight,
  };
};

export default nestDialogue;
