import { readFile } from 'fs/promises';
import parseTlkV1FromBuffer from './parseTlkV1FromBuffer.js';

import type { TlkItem, Tlk } from './types.js';
import type { Pathes } from 'src/steps/1.createPathes/index.js';

const tlkParse = async (tlkPath: Pathes['tlkPath']): Promise<Tlk> => {
  const buffer = await readFile(tlkPath);

  const raw = parseTlkV1FromBuffer(buffer);

  // There are a lot of references to 4294967295
  // I change 4294967295 to -1 to make it easy to use
  // I also add artificial tlk item with id -1
  // to make it easy to render later
  const emptyTlkItem: TlkItem = {
    index: -1,
    flags: 0,
    soundResRef: '',
    volume: 0,
    pitch: 0,
    offset: -1,
    length: 3,
    text: 'n/a',
  };
  raw.itemsMap.set(-1, emptyTlkItem);
  return raw;
};

export default tlkParse;
