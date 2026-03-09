import { readFile } from 'fs/promises';
import type { Pathes } from '../../shared/types.js';
import type { TlkEntry } from './types.js';
import readTlkBuffer from './patches/readTlkBuffer.js';

const convertTlk = async (pathes: Pathes): Promise<TlkEntry> => {
  const buffer = await readFile(pathes.tlkPath);
  const raw = await readTlkBuffer(buffer);
  raw.itemsMap.set(-1, {
    index: -1,
    flags: 0,
    soundResRef: '',
    volume: 0,
    pitch: 0,
    offset: -1,
    length: 3,
    text: 'n/a',
  });
  return raw;
};

export default convertTlk;
