import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { parseIdsV1 } from './v1/index.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { Ids } from './types.js';

export const parseIds = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<Ids> => iterate<DecompiledBiff, Ids>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const ids = parseIdsV1({
      buffer,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'ids_raw2json',
      params: {
        resourceName,
      },
    });

    return ids;
  },
);
