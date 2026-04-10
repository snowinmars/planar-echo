import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/pipes/readers.js';
import { reportProgress } from '@/shared/report.js';
import parseEffV20FromBuffer from './v20/parfeEffectV20.js';
import createMeta from '../meta.js';

import type { Maybe } from '@planar/shared';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { Signature, Versions } from './types.js';
import type { EffectV20 } from './v20.types/effectV20.js';
import type { Ids } from '../ids/index.js';

// There are no header for effV10, so
// I cannot detect what version of the eff format to use,
// but the user can, so I export two parseEff function
// Sad, but true
const parseEffV10 = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
): AsyncIterableIterator<EffectV20> => iterate<DecompiledBiff, EffectV20>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'eff') throw new Error(`Unsupported signature '${signature}' for effect`);
    if (version !== 'v2.0') throw new Error(`Unsupported version '${version}' for effect`);

    const meta = createMeta<Signature, Versions>({
      signature: 'eff',
      version: 'v2.0',
      gameName: pathes.gameName,
      resourceName,
      ids,
    });

    const effect = parseEffV20FromBuffer(reader, meta);

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'effV20_raw2json',
      params: {
        version: meta.version,
        resourceName,
      },
    });

    return effect;
  },
);

export default parseEffV10;
