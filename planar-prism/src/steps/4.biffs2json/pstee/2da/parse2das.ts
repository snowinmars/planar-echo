import { readFile } from 'fs/promises';
import { join } from 'path';

import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parse2daV1 } from './v1/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawTwoda } from './parse2das.types.js';

export const parse2das = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  xorKey: number[],
): AsyncIterableIterator<RawTwoda> => iterate<DecompiledBiff, RawTwoda>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const table = parse2daV1({
      buffer,
      resourceName,
      xorKey,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'twoda_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return table;
  },
);
