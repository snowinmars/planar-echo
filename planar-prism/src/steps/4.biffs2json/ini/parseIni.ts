import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '../../../shared/maybe.js';
import iterate from '../../../steps/iterate.js';
import parseIniV1FromBuffer from './v1/parseIniV1FromBuffer.js';

import type { DecompiledBiff } from '../../../steps/3.decompileBiffs/index.js';
import type { Pathes } from '../../../steps/1.createPathes/index.js';
import type { LogPercent } from '../../../shared/types.js';
import type { Ini, Signature, Versions } from './types.js';
import type { Maybe } from '../../../shared/maybe.js';
import type { Ids } from '../ids/index.js';
import createMeta from '../meta.js';

const parseIni = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Ini> => iterate<DecompiledBiff, Ini>(
  decompiledItems,
  async (decompiledItem) => {
    const resourceName = decompiledItem.resourceName;

    const meta = createMeta<Signature, Versions>({
      signature: 'ini',
      version: 'v1.0',
      resourceName,
      gameName: pathes.gameName,
      ids,
    });

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const raw = parseIniV1FromBuffer(buffer, meta);

    return raw;
  },
  percentCallback,
);

export default parseIni;
