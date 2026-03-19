import { nothing } from '../../../../../shared/maybe.js';

import type { RawDlg, Dlg } from '../../types.js';
import type { DlgState } from '../../v1.types/2.states.js';
import type { RawResponse, DlgResponse } from '../../v1.types/3.response.js';
import type { RawFunction } from '../../v1.types/4.function.js';

type NestResponseProps = Readonly<{
  response: RawResponse;
  responsesTriggers: Map<number, RawFunction>;
  responsesActions: Map<number, RawFunction>;
}>;
const nestResponse = ({
  response,
  responsesTriggers,
  responsesActions,
}: NestResponseProps): DlgResponse => {
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
  state: RawDlg['states'][number];
  responses: RawDlg['responses'];
  stateTriggers: RawDlg['stateTriggers'];
  responsesTriggers: RawDlg['responsesTriggers'];
  responsesActions: RawDlg['responsesActions'];
}>;
const nestState = ({
  state,
  responses,
  stateTriggers,
  responsesTriggers,
  responsesActions,
}: NestStateProps): DlgState => {
  const _responses = responses
    .slice(state.firstResponseIndex, state.firstResponseIndex + state.responsesCount)
    .map(r => nestResponse({
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
    origins: state.stateOrigins,
    weightStates: state.weightStates,
    textTlk: state.textTlk,
  };
};

export const nestDialogue = (dialogue: RawDlg): Dlg => {
  const nestedStates = dialogue.states
    .map(state => nestState({
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
