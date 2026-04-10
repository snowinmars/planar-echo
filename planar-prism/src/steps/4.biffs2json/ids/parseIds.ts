import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import parseIdsV1FromBuffer from './v1/parseIdsV1FromBuffer.js';

import type { Maybe } from '@planar/shared';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { Ids } from './types.js';

const parseIds = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<Ids> => iterate<DecompiledBiff, Ids>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const raw = parseIdsV1FromBuffer(buffer, resourceName);

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'ids_raw2json',
      params: {
        resourceName,
      },
    });

    return raw;
  },
);

export default parseIds;
