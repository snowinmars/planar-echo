import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseMosV1Json } from './v1/parseMosV1.js';
import { parseMosV2Json } from './v2/parseMosV2.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawMos } from './parseMoss.types.js';

export const parseMoss = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawMos> => iterate<DecompiledBiff, RawMos>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);
    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'mos') throw new Error(`Unsupported signature '${signature}' for mos '${resourceName}'`);
    if (version !== 'v1' && version !== 'v2') throw new Error(`Unsupported version '${version}' for mos '${resourceName}'`);

    const mos = version === 'v1'
      ? parseMosV1Json({ reader, resourceName })
      : parseMosV2Json({ reader, resourceName });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'mos_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return mos;
  },
);
