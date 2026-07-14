import { nothing } from '@planar/shared';
import type { NestedDlg, NestedDlgResponse } from './4.nestDialogue.types.js';

const getEmptyResponses = (index: number): NestedDlgResponse[] => {
  const emptyResponse: NestedDlgResponse = {
    index,
    flags: [
      'has associated text',
      'terminates dialog',
    ],
    textTlk: '...',
    trigger: nothing(),
    action: nothing(),
    nextDialog: nothing(),
    nextDialogState: nothing(),
    journalId: nothing(),
    journalTlk: nothing(),
  };

  return [emptyResponse];
};
const extendWithEmptyResponses = (dlg: NestedDlg): NestedDlg => {
  let lastResponseId = dlg.states.reduce((acc, cur) => acc + cur.responses.length, 0);
  const newStates = dlg.states.map((state) => {
    if (state.responses.length > 0) return state;
    const responses = getEmptyResponses(lastResponseId);
    lastResponseId++;
    return {
      ...state,
      responses,
    };
  });
  return {
    ...dlg,
    states: newStates,
  };
};

export default extendWithEmptyResponses;
