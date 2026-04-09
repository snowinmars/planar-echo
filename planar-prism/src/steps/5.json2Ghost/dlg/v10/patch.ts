import type { Tlk } from '@/steps/4.biffs2json/tlk/index.js';
import type { GhostDlg } from './types.js';
import type { RawDlg } from '@/steps/4.biffs2json/dlg/index.js';
import attachWeights from './1.attachWeights.js';
import patchTranslation from './2.patchTranslation.js';
import nestDialogue from './3.nestDialogue.js';

const patchDlgs = (dlgs: RawDlg[], tlk: Tlk): GhostDlg[] => {
  return dlgs
    .map((dlg) => {
      switch (dlg.header.version) {
        case 'v1.0': {
          const weighted = attachWeights(dlg);
          const translated = patchTranslation(weighted, tlk);
          const nested = nestDialogue(translated);
          return nested;
        }
        default: throw new Error(`Out of range: '${dlg.header.version}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
      }
    });
};

export default patchDlgs;
