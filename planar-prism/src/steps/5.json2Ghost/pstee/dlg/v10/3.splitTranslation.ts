import splitDmorte1Dlg from './split/dmorte1Dlg.js';

import type { TlkedDlg } from './2.patchTranslation.types.js';
import type { SplittedDlg } from './3.splitTranslation.types.js';
import type { Splitter } from './types.js';
import { nothing, type GameLanguage } from '@planar/shared';

const getSplitter = (dlg: TlkedDlg, language: GameLanguage): Splitter => {
  switch (dlg.resourceName) {
    case 'dmorte1.dlg': return splitDmorte1Dlg(language);
    default: return x => ({
      ...x,
      action: nothing(),
      textTlkSplits: [],
    });
  }
};

const splitTranslation = (dlg: TlkedDlg, language: GameLanguage): SplittedDlg => {
  const split = getSplitter(dlg, language);
  const states = dlg.states.map(state => split(state));

  return {
    ...dlg,
    states,
  };
};

export default splitTranslation;
