import { nothing } from '@planar/shared';

import type { RawState } from '@/steps/4.biffs2json/dlg/v1.types/2.states.js';
import type { RawResponse } from '@/steps/4.biffs2json/dlg/v1.types/3.response.js';
import type { Tlk } from '@/steps/4.biffs2json/tlk/index.js';
import type { TlkedDlg, TlkedResponse, TlkedState } from './2.patchTranslation.types.js';
import type { WeightedDlg } from './1.attachWeights.types.js';

const patchState = (state: RawState, tlk: Tlk): TlkedState => {
  const hasText = state.textRef && state.textRef > 0;

  const textTlk = hasText ? tlk.getText(state.textRef) : nothing();

  return {
    ...state,
    textTlk,
  };
};

const patchResponse = (response: RawResponse, tlk: Tlk): TlkedResponse => {
  const hasText = response.textRef && response.textRef > 0;
  const hasJournal = response.journalRef && response.journalRef > 0;

  const textTlk = hasText ? tlk.getText(response.textRef) : nothing();
  const journalTlk = hasJournal ? tlk.getText(response.journalRef) : nothing();

  return {
    ...response,
    textTlk,
    journalTlk,
  };
};

const patchTranslation = (dialogue: WeightedDlg, tlk: Tlk): TlkedDlg => {
  return {
    resourceName: dialogue.resourceName,
    header: dialogue.header,
    stateTriggers: dialogue.stateTriggers,
    responsesTriggers: dialogue.responsesTriggers,
    responsesActions: dialogue.responsesActions,
    stateIndicesOrderedByWeight: dialogue.stateIndicesOrderedByWeight,
    states: dialogue.states.map(state => patchState(state, tlk)),
    responses: dialogue.responses.map(response => patchResponse(response, tlk)),
  };
};

export default patchTranslation;
