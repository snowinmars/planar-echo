import splitRuDmorte1Dlg from './ru/dmorte1Dlg.js';

import type { GameLanguage } from '@planar/shared';
import type { Splitter } from '../types.js';

const splitDmorte1Dlg = (language: GameLanguage): Splitter => {
  switch (language) {
    case 'ru_RU': return splitRuDmorte1Dlg;
    default: throw new Error(`Language is out of range: '${language}'`);
  }
};

export default splitDmorte1Dlg;
