import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { loadBcsBytecode } from './v1/loadBcsBytecode.js';
import { parseBytecode } from './v1/bytecode/index.js';
import { translateRawBcs } from './v1/translator/index.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { RawBcsContext } from './context/buildBcsContext.types.js';
import type { RawBcs } from './v1/translator/translateRawBcs.types.js';

export const parseBcs = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  ctx: RawBcsContext,
): AsyncIterableIterator<RawBcs> => {
  return iterate<DecompiledBiff, RawBcs>(
    decompiledBiffs,
    async ({ resourceName }, i) => {
      const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
      const code = loadBcsBytecode(buffer, ctx.xorKey);
      const parsed = parseBytecode(code);
      const bcs = translateRawBcs(parsed, resourceName, ctx);

      const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
      reportProgress({
        value: percent,
        step: 'bcs_raw2json',
        params: {
          resourceName,
          rssBytes: process.memoryUsage().rss,
        },
      });

      return bcs;
    },
  );
};
