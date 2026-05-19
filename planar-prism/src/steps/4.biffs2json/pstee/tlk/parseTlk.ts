import { createReader } from '@/shared/bufferReader.js';
import { readFile } from 'fs/promises';
import { parseTlkV1 } from './v1/index.js';
import { reportProgress } from '@/shared/report.js';

import type { Tlk } from './types.js';
import type { TlkItem } from './v1/parsers/2.parseItemsV1.types.js';

export const parseTlk = async (resourceName: string): Promise<Tlk> => {
  const buffer = await readFile(resourceName);
  const reader = createReader(buffer);

  const signature = reader.string(4);
  const version = reader.string(4);

  if (signature !== 'tlk') throw new Error(`Unsupported signature for tlk: '${signature}'`);
  if (version !== 'v1') throw new Error(`Unsupported version for tlk: '${version}'`);

  reportProgress({
    value: 1,
    step: 'tlk_raw2json',
    params: {
      version: version,
      resourceName,
    },
  });

  const tlk = parseTlkV1({
    reader,
    signature,
    version,
  });

  // There are a lot of references to 4294967295
  // I change 4294967295 to -1 to make it easy to use
  // I also add artificial tlk item with id -1
  // to make it easy to render later
  const emptyTlkItem: TlkItem = {
    index: -1,
    flags: ['no message data'],
    soundResRef: '',
    volume: 0,
    pitch: 0,
    stringsOffset: -1,
    stringsLength: 3,
    text: 'n/a',
  };
  tlk.itemsMap.set(-1, emptyTlkItem);

  reportProgress({
    value: 100,
    step: 'tlk_raw2json',
    params: {
      version: version,
      resourceName,
    },
  });

  return {
    ...tlk,
  };
};
