import { readFile } from 'fs/promises';
import { join } from 'path';

import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseTisV1Json } from './v1/parseTisV1.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawWed } from '../wed/index.js';
import type { RawTis } from './parseTiss.types.js';

export const parseTiss = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  wedIndex: Map<string, RawWed>,
): AsyncIterableIterator<RawTis> => iterate<DecompiledBiff, RawTis>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'tis') throw new Error(`Unsupported signature '${signature}' for tis resource '${resourceName}'`);
    if (version !== 'v1') throw new Error(`Unsupported version '${version}' for tis resource '${resourceName}'`);

    const tis = parseTisV1Json({
      resourceName,
      reader,
      wedIndex,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'tis_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return tis;
  },
);
