import { readFile } from 'fs/promises';
import type { Pathes } from '../../shared/types.js';
import type { TlkEntry } from './types.js';
import readTlkBuffer from './patches/readTlkBuffer.js';

const convertTlk = async (pathes: Pathes): Promise<TlkEntry> => {
  const buffer = await readFile(pathes.tlkPath);
  const raw = await readTlkBuffer(buffer);
  return raw;
};

export default convertTlk;
