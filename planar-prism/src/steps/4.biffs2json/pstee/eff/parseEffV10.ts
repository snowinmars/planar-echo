import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseEffectV10 } from './v10/parseEffectV10.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { EffectV10 } from './v10/parseEffectV10.types.js';

// There are no header for effV10, so
// I cannot detect what version of the eff format to use,
// but the user can, so I export two parseEff function
// Sad, but true
export const parseEffV10 = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<EffectV10> => iterate<DecompiledBiff, EffectV10>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const effect = parseEffectV10({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'effV10_raw2json',
      params: {
        version: 'v1.0',
        resourceName,
      },
    });

    return effect;
  },
);
