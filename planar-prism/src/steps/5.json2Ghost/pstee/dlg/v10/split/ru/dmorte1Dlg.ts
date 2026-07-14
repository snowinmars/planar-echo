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
        .writeLine(`l.talk('morte');`, 8)
        .writeLine(`return {`, 8)
        .writeLine(`id: 'playSound',`, 10)
        .writeLine(`args: {`, 10)
        .writeLine(`sound: 'morte1_state0',`, 12)
        .writeLine(`},`, 10)
        .writeLine(`};`, 8)
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
