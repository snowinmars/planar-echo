import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import parseIniV1FromBuffer from './v1/parseIniV1FromBuffer.js';
import createMeta from '../meta.js';
import { reportProgress } from '@/shared/report.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { LogPercent } from '@/shared/types.js';
import type { Maybe } from '@planar/shared';
import type { Ini, Signature, Versions } from './types.js';
import type { Ids } from '../ids/index.js';

const parseIni = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Ini> => iterate<DecompiledBiff, Ini>(
  decompiledItems,
  async (decompiledItem, i) => {
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

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'parseIni',
      params: {
        version: 'V1.0',
        resourceName,
      },
    });

    return raw;
  },
  percentCallback,
);

export default parseIni;
