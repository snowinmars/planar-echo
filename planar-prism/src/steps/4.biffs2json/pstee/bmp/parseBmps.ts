import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import {
  BMP_V1_HEADER_SIZE,
  BMP_V3_HEADER_SIZE,
  BMP_V4_HEADER_SIZE,
  BMP_V5_HEADER_SIZE,
} from './parseBmps.const.js';
import { parseBmpV1Json } from './v1/parseBmpV1.js';
import { parseBmpV5Json } from './v5/parseBmpV5.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawBmp } from './parseBmps.types.js';

export const parseBmps = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawBmp> => iterate<DecompiledBiff, RawBmp>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);
    const signature = reader.string(2);

    if (signature !== 'bm') throw new Error(`Unsupported signature '${signature}' for bmp '${resourceName}'`);

    const headerReader = reader.fork(14);
    const infoHeaderSize = headerReader.uint();

    const isBmpV1 = infoHeaderSize === BMP_V1_HEADER_SIZE;
    const isBmpV5 = infoHeaderSize === BMP_V3_HEADER_SIZE || infoHeaderSize === BMP_V4_HEADER_SIZE || infoHeaderSize === BMP_V5_HEADER_SIZE;

    let bmp: RawBmp;
    if (isBmpV1) bmp = parseBmpV1Json({ reader, resourceName });
    else if (isBmpV5) bmp = parseBmpV5Json({ reader, resourceName });
    else throw new Error(`Unsupported bpm header size '${infoHeaderSize}' for resource '${resourceName}'`);

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'bmp_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return bmp;
  },
);
