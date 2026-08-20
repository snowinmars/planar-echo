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
import { parseBmpV1 } from './v1/parseBmpV1.js';
import { parseBmpV5 } from './v5/parseBmpV5.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawBmpV1Artifacts } from './v1/parseBmpV1.types.js';
import type { RawBmpV5Artifacts } from './v5/parseBmpV5.types.js';

type RawBmpArtifacts = RawBmpV1Artifacts | RawBmpV5Artifacts;

export const parseBmps = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawBmpArtifacts> => iterate<DecompiledBiff, RawBmpArtifacts>(
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

    let artifacts: RawBmpArtifacts;
    if (isBmpV1) artifacts = parseBmpV1({ reader, resourceName });
    else if (isBmpV5) artifacts = parseBmpV5({ reader, resourceName });
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

    return artifacts;
  },
);
