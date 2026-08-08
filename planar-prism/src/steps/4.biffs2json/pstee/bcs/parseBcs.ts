import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { loadBcsBytecode } from './loadBcsBytecode.js';
import { decompileScript } from './v1/decompileScript/decompileScript.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBcs } from './types.js';
import type { BcsContext } from './v1/decompileScript/decompileScript.js';

export const parseBcs = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
  ctx: BcsContext,
): AsyncIterableIterator<DecompiledBcs> => {
  return iterate<DecompiledBiff, DecompiledBcs>(
    decompiledItems,
    async (decompiledItem, i) => {
      const resourceName = decompiledItem.resourceName;
      const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
      const code = loadBcsBytecode(buffer, ctx.xorKey);
      const bcs = decompileScript(code, resourceName, ctx);

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      reportProgress({
        value: percent,
        step: 'bcs_raw2json',
        params: { resourceName },
      });

      return bcs;
    },
  );
};
