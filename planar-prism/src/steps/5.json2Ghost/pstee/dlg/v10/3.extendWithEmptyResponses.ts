import { nothing } from '@planar/shared';
import type { NestedDlg, NestedDlgResponse } from './2.nestDlg.types.js';

const getEmptyResponses = (index: number): NestedDlgResponse[] => {
  const emptyResponse: NestedDlgResponse = {
    index,
    flags: [
      'has associated text',
      'terminates dialog',
    ],
    textRef: nothing(),
    trigger: nothing(),
    action: nothing(),
    nextDlg: nothing(),
    nextDlgState: nothing(),
    journalRef: nothing(),
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
