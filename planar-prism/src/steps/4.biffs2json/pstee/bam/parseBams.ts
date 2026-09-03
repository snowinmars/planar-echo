import { readFile } from 'fs/promises';
import { join } from 'path';
import { inflateSync } from 'zlib';

import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseBamV1Json } from './v1/parseBamV1.js';
import { parseBamV2Json } from './v2/parseBamV2.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawBam } from './parseBams.types.js';

const inflateBamc = (buffer: Buffer): Buffer => Buffer.from(inflateSync(buffer.subarray(12)));

export const parseBams = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawBam> => iterate<DecompiledBiff, RawBam>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const raw = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    let buffer: Buffer = raw;
    let reader = createReader(buffer);
    let signature = reader.string(4);
    let version = reader.string(4);

    if (signature === 'bamc') {
      buffer = inflateBamc(raw);
      reader = createReader(buffer);
      signature = reader.string(4);
      version = reader.string(4);
    }

    if (signature !== 'bam') throw new Error(`Unsupported signature '${signature}' for bam '${resourceName}'`);
    if (version !== 'v1' && version !== 'v2') throw new Error(`Unsupported version '${version}' for bam '${resourceName}'`);

    const bam = version === 'v1'
      ? parseBamV1Json({ reader, resourceName })
      : parseBamV2Json({ reader, resourceName });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'bam_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return bam;
  },
);
