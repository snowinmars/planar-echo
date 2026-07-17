import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseItmV10 } from './v10/index.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { ItmV10 } from './types.js';

export const parseItm = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<ItmV10> => iterate<DecompiledBiff, ItmV10>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;
    const buffer = await readFile(join(pathes.ghostDir.decompiledBiff.root, resourceName));

    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'itm') throw new Error(`Unsupported signature '${signature}' for item '${resourceName}'`);
    if (version !== 'v1') throw new Error(`Unsupported version '${version}' for item '${resourceName}'`);

    const itm = parseItmV10({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'itm_raw2json',
      params: {
        version: version,
        resourceName,
      },
    });

    return itm;
  },
);
