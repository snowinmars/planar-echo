import { readFile } from 'fs/promises';
import { join } from 'path';

import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseSrcV1 } from './v1/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawSrc } from './parseSrcs.types.js';

export const parseSrcs = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawSrc> => iterate<DecompiledBiff, RawSrc>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const src = parseSrcV1({
      buffer,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'src_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return src;
  },
);
