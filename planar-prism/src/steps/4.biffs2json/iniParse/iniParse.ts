import { join } from 'path';
import { readFile } from 'fs/promises';
import type { DecompiledBiff } from 'src/steps/3.decompileBiffs/index.js';
import type { Pathes } from 'src/steps/1.createPathes/index.js';
import type { Ids } from './types.js';
import type { LogPercent } from '../../../shared/types.js';
import { nothing, type Maybe } from '../../../shared/maybe.js';
import iterate from '../../../steps/iterate.js';
import parseIdsV1FromBuffer from './v1/parseIdsV1FromBuffer.js';

const iniParse = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Ids> => iterate<Ids>(
  decompiledItems,
  async (decompiledItem) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const raw = parseIniV1FromBuffer(buffer, resourceName);

    return raw;
  },
  percentCallback,
);

export default iniParse;
