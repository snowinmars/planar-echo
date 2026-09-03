import { readFile } from 'fs/promises';
import { join } from 'path';

import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseItmV10 } from './v10/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawItmV10 } from './parseItms.types.js';

export const parseItms = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawItmV10> => iterate<DecompiledBiff, RawItmV10>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));

    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'itm') throw new Error(`Unsupported signature '${signature}' for itm '${resourceName}'`);
    if (version !== 'v1') throw new Error(`Unsupported version '${version}' for itm '${resourceName}'`);

    const itm = parseItmV10({
      reader,
      resourceName,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'itm_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return itm;
  },
);
