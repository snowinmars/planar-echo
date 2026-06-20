import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { parseIniV1 } from './v1/index.js';
import { reportProgress } from '@/shared/report.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { Ini } from './types.js';

export const parseIni = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<Ini> => iterate<DecompiledBiff, Ini>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;
    const buffer = await readFile(join(pathes.ghostDir.decimpiledBiff.root, resourceName));
    const raw = parseIniV1({
      buffer,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'ini_raw2json',
      params: {
        version: 'V1.0',
        resourceName,
      },
    });

    return raw;
  },
);
