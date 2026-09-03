import { readFile } from 'fs/promises';
import { join } from 'path';

import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseEffV10 } from './v10/parseEffV10.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawEffV10 } from './v10/parseEffV10.types.js';

// There are no header for effV10, so
// I cannot detect what version of the eff format to use,
// but the user can, so I export two parseEff function
// Sad, but true
export const parseEffsV10 = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawEffV10> => iterate<DecompiledBiff, RawEffV10>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const eff = parseEffV10({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'effV10_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return eff;
  },
);
