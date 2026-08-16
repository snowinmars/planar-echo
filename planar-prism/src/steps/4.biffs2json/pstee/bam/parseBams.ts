import { join } from 'path';
import { readFile } from 'fs/promises';
import { inflateSync } from 'zlib';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseBamV1 } from './v1/parseBamV1.js';
import { parseBamV2 } from './v2/parseBamV2.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawPvrRgbaImage } from '../pvrz/decode/index.js';
import type { RawBamV1Artifacts } from './v1/parseBamV1.types.js';
import type { RawBamV2Artifacts } from './v2/parseBamV2.types.js';

type RawBamArtifacts = RawBamV1Artifacts | RawBamV2Artifacts;

const inflateBamc = (buffer: Buffer): Buffer => Buffer.from(inflateSync(buffer.subarray(12)));

export const isBamV1Artifacts = (x: RawBamArtifacts): x is RawBamV1Artifacts => x.bam.header.version === 'v1';

export const parseBams = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>,
): AsyncIterableIterator<RawBamArtifacts> => iterate<DecompiledBiff, RawBamArtifacts>(
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

    let artifacts: RawBamArtifacts;
    switch (version) {
      case 'v1': {
        artifacts = parseBamV1({ reader, resourceName });
        break;
      }
      case 'v2': {
        artifacts = parseBamV2({ reader, resourceName, pvrzRgbaIndex });
        break;
      }
    }

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'bam_raw2json',
      params: {
        version: artifacts.bam.header.version,
        resourceName,
      },
    });

    return artifacts;
  },
);
