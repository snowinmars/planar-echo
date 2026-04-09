import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/pipes/readers.js';
import { reportProgress } from '@/shared/report.js';
import parseEffV10FromBuffer from './v10/parfeEffectV10.js';
import createMeta from '../meta.js';

import type { Maybe } from '@planar/shared';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { EffectV10 } from './v10.types/effectV10.js';
import type { Ids } from '../ids/index.js';
import type { Signature, Versions } from './types.js';

// There are no header for effV10, so
// I cannot detect what version of the eff format to use,
// but the user can, so I export two parseEff function
// Sad, but true
const parseEffV10 = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
): AsyncIterableIterator<EffectV10> => iterate<DecompiledBiff, EffectV10>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;
    const meta = createMeta<Signature, Versions>({
      signature: 'eff',
      version: 'v1.0',
      gameName: pathes.gameName,
      resourceName,
      ids,
    });

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const effect = parseEffV10FromBuffer(reader, meta);

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'parseEffV10',
      params: {
        version: meta.version,
        resourceName,
      },
    });

    return effect;
  },
);

export default parseEffV10;
