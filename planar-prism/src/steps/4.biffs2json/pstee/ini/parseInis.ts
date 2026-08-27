import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { parseIniV1 } from './v1/index.js';
import { reportProgress } from '@/shared/report.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { RawIni } from './parseInis.types.js';
import type { RawIds } from '../ids/index.js';

export const parseInis = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  ids: Map<string, RawIds>,
): AsyncIterableIterator<RawIni> => iterate<DecompiledBiff, RawIni>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const raw = parseIniV1({
      buffer,
      resourceName,
      ids,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'ini_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return raw;
  },
);
