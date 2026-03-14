import type { Tlk } from '../../../../../steps/4.biffs2json/tlk/index.js';
import type { RawDlg } from '../../types.js';
import type { RawState } from '../../v1.types/2.states.js';
import type { RawResponse } from '../../v1.types/3.response.js';

const patchState = (state: RawState, tlk: Tlk): RawState => {
  const hasText = state.textRef && state.textRef > 0;
  if (!hasText) return state;

  const textTlk = tlk.get(state.textRef);
  return {
    ...state,
    textTlk,
  };
};

const patchResponse = (response: RawResponse, tlk: Tlk): RawResponse => {
  const hasText = response.textRef && response.textRef > 0;
  const hasJournal = response.journalRef && response.journalRef > 0;

  const textTlk = hasText ? tlk.get(response.textRef) : response.textTlk;
  const journalTlk = hasJournal ? tlk.get(response.journalRef) : response.journalTlk;

  return {
    ...response,
    textTlk,
    journalTlk,
  };
};

const patchTranslation = (dialogue: RawDlg, tlk: Tlk): RawDlg => {
  return {
    ...dialogue,
    states: dialogue.states.map(state => patchState(state, tlk)),
    responses: dialogue.responses.map(response => patchResponse(response, tlk)),
  };
};

export default patchTranslation;
