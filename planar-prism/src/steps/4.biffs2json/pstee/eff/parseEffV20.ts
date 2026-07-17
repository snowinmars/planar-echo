import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseEffectV20 } from './v20/parseEffectV20.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { EffectV20 } from './v20/parseEffectV20.types.js';

// There are no header for effV10, so
// I cannot detect what version of the eff format to use,
// but the user can, so I export two parseEff function
// Sad, but true
export const parseEffV20 = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
): AsyncIterableIterator<EffectV20> => iterate<DecompiledBiff, EffectV20>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'eff') throw new Error(`Unsupported signature '${signature}' for effect`);
    if (version !== 'v2.0') throw new Error(`Unsupported version '${version}' for effect`);

    const effect = parseEffectV20({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'effV20_raw2json',
      params: {
        version: 'v2.0',
        resourceName,
      },
    });

    return effect;
  },
);
