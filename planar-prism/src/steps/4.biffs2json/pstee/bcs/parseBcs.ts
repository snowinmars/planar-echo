import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { loadBcsBytecode } from './v1/loadBcsBytecode.js';
import { parseBytecode } from './v1/bytecode/index.js';
import { translateScript } from './v1/translator/index.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { Bcs } from './parseBcs.types.js';
import type { BcsContext } from './buildBcsContext.types.js';

export const parseBcs = (
  paths: Paths,
  decompiledItems: DecompiledBiff[],
  ctx: BcsContext,
): AsyncIterableIterator<Bcs> => {
  return iterate<DecompiledBiff, Bcs>(
    decompiledItems,
    async (decompiledItem, i) => {
      const resourceName = decompiledItem.resourceName;
      const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
      const code = loadBcsBytecode(buffer, ctx.xorKey);
      const parsed = parseBytecode(code);
      const bcs = translateScript(parsed, resourceName, ctx);

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
