import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '../../../shared/maybe.js';
import iterate from '../../../steps/iterate.js';
import parseIdsV1FromBuffer from './v1/parseIdsV1FromBuffer.js';

import type { Maybe } from '../../../shared/maybe.js';
import type { DecompiledBiff } from '../../../steps/3.decompileBiffs/index.js';
import type { Pathes } from '../../../steps/1.createPathes/index.js';
import type { Ids } from './types.js';
import type { LogPercent } from '../../../shared/types.js';

const parseIds = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Ids> => iterate<DecompiledBiff, Ids>(
  decompiledItems,
  async (decompiledItem) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const raw = parseIdsV1FromBuffer(buffer, resourceName);

    return raw;
  },
  percentCallback,
);

export default parseIds;
