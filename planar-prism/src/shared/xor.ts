import { sleep } from '@planar/shared';

import {
  entryExists,
  loadFromFile,
  saveToFile,
} from '@/shared/customFs.js';

// Same transform as BCS: NearInfinity StaticSimpleXorDecryptor
// https://github.com/NearInfinityBrowser/NearInfinity/blob/master/src/org/infinity/util/StaticSimpleXorDecryptor.java
export const xorDecrypt = (buffer: Buffer, offset: number, xorKey: number[]): Buffer => {
  const out = Buffer.alloc(buffer.length - offset);
  let decOff = 0;
  for (let i = offset; i < buffer.length; i++) {
    const b = buffer[i]!;
    const signed = b > 127 ? b - 256 : b;
    out[i - offset] = ((256 + signed) ^ xorKey[decOff]!) & 0xff;
    decOff = (decOff + 1) % xorKey.length;
  }
  return out;
};

const parseXorKey = (code: string): number[] => {
  const keyBlockMatch = code.match(/KEY\s*=\s*\{([\s\S]*?)\}/);
  if (!keyBlockMatch || !keyBlockMatch[1]) throw new Error(`Cannot find InfinityEngine xorKey from NearInfinity sources`);

  const hexValues = keyBlockMatch[1].match(/0x[0-9a-fA-F]+/g);
  if (!hexValues) throw new Error(`Cannot find hex values in the InfinityEngine xorKey from NearInfinity sources`);

  const numbers = hexValues.map(hex => parseInt(hex, 16));
  if (numbers.length !== 64 || numbers.some(x => isNaN(x))) throw new Error('Got broken value of the InfinityEngine xorKey from NearInfinity sources');

  return numbers;
};

const XOR_KEY_LENGTH = 64;
const isXorKey = (value: unknown): value is number[] =>
  Array.isArray(value)
  && value.length === XOR_KEY_LENGTH
  && value.every(x => typeof x === 'number' && Number.isFinite(x));

const XOR_KEY_FETCH_ATTEMPTS = 3;
const XOR_KEY_FETCH_RETRY_DELAY_MS = 1000;
const fetchXorKey = async (): Promise<number[]> => {
  const url = 'https://raw.githubusercontent.com/NearInfinityBrowser/NearInfinity/master/src/org/infinity/util/StaticSimpleXorDecryptor.java';
  let lastError: unknown = new Error('Could not load InfinityEngine xor key');

  for (let attempt = 0; attempt < XOR_KEY_FETCH_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Could not load InfinityEngine xorKey: HTTP '${response.status}'`);

      return parseXorKey(await response.text());
    }
    catch (error: unknown) {
      lastError = error;
      const hasMoreAttempts = attempt + 1 < XOR_KEY_FETCH_ATTEMPTS;
      if (hasMoreAttempts) await sleep(XOR_KEY_FETCH_RETRY_DELAY_MS);
    }
  }

  throw lastError;
};

export const loadXorKey = async (cachePath: string): Promise<number[]> => {
  const cacheExists = await entryExists(cachePath);
  if (cacheExists) {
    try {
      const cached = await loadFromFile<unknown>(cachePath);
      if (isXorKey(cached)) return cached;
    }
    catch {
      // Invalid cache is treated as a miss and replaced after a successful fetch.
    }
  }

  const xorKey = await fetchXorKey();
  await saveToFile(cachePath, xorKey);
  return xorKey;
};
