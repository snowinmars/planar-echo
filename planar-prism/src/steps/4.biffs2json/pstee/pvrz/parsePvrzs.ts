import { createReader } from '@/shared/bufferReader.js';
import { inflateSync } from 'zlib';
import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { parsePvr } from './pvr/parsePvr.js';

import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Paths } from '@/steps/1.createPaths/index.js';
import type { RawPvrPixelPvr } from './pvr/parsePvr.types.js';

export const parsePvrzs = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawPvrPixelPvr> => iterate<DecompiledBiff, RawPvrPixelPvr>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const sizeOfPvrSignatureInBytes = 4; // PVR_SIGNATURE = 0x03525650
    const pvrBuffer = inflateSync(buffer.subarray(sizeOfPvrSignatureInBytes));

    const reader = createReader(pvrBuffer);
    const parsed = parsePvr(reader, resourceName);

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'pvrz_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return parsed;
  },
);
