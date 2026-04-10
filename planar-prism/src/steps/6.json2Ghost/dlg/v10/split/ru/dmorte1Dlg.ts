import createWriter from '@/shared/writer.js';
import { nothing } from '@planar/shared';

import type { TlkedState } from '../../2.patchTranslation.types.js';
import type { SplittedState } from '../../3.splitTranslation.types.js';
import type { Splitter } from '../../types.js';

const splitRuDmorte1Dlg: Splitter = (state: TlkedState): SplittedState => {
  switch (state.index) {
    case 0: return {
      ...state,
      textTlkSplits: [5],
      action: createWriter()
        .writeLine(`l.talkMorte();`, 6)
        .writeLine(`return {`, 6)
        .writeLine(`id: 'playSound',`, 8)
        .writeLine(`args: {`, 8)
        .writeLine(`sound: 'morte1_state0',`, 10)
        .writeLine(`},`, 8)
        .writeLine(`};`, 6)
        .done(),
    };
    default: return {
      ...state,
      action: nothing(),
      textTlkSplits: [],
    };
  }
};

export default splitRuDmorte1Dlg;
