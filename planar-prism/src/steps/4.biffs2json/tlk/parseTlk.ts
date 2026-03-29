import { createReader } from '@/pipes/readers.js';
import { readFile } from 'fs/promises';
import parseTlkV1FromBuffer from './v1/parseTlkV1FromBuffer.js';

import type { Tlk } from './types.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { Item } from './v1.types/2.item.js';
import { reportProgress } from '@/shared/report.js';

const parseTlk = async (resourceName: Pathes['tlkPath']): Promise<Tlk> => {
  const buffer = await readFile(resourceName);
  const reader = createReader(buffer);

  const signature = reader.string(4);
  const version = reader.string(4);

  if (signature !== 'tlk') throw new Error(`Unsupported signature for tlk: '${signature}'`);
  if (version !== 'v1') throw new Error(`Unsupported version for tlk: '${version}'`);

  reportProgress({
    value: 1,
    step: 'parseTlk',
    params: {
      version: version,
      resourceName,
    },
  });

  const raw = parseTlkV1FromBuffer(
    reader,
    signature,
    version,
  );

  // There are a lot of references to 4294967295
  // I change 4294967295 to -1 to make it easy to use
  // I also add artificial tlk item with id -1
  // to make it easy to render later
  const emptyTlkItem: Item = {
    index: -1,
    flags: ['no message data'],
    soundResRef: '',
    volume: 0,
    pitch: 0,
    offset: -1,
    length: 3,
    text: 'n/a',
  };
  raw.itemsMap.set(-1, emptyTlkItem);

  reportProgress({
    value: 100,
    step: 'parseTlk',
    params: {
      version: version,
      resourceName,
    },
  });

  return {
    ...raw,
  };
};

export default parseTlk;
