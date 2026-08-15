import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseMosV1 } from './v1/parseMosV1.js';
import { parseMosV2 } from './v2/parseMosV2.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawPvrRgbaImage } from '../pvrz/decode/index.js';
import type { RawMosV2Artifacts } from './v2/parseMosV2.types.js';
import type { RawMosV1Artifacts } from './v1/parseMosV1.types.js';

type RawMosArtifacts = RawMosV1Artifacts | RawMosV2Artifacts;
export const parseMoss = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>,
): AsyncIterableIterator<RawMosArtifacts> => iterate<DecompiledBiff, RawMosArtifacts>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);
    const signature = reader.string(4);
    const version = reader.string(4);

    let artifacts: RawMosArtifacts;

    if (signature !== 'mos') throw new Error(`Unsupported signature '${signature}' for mos '${resourceName}'`);
    if (version !== 'v1' && version !== 'v2') throw new Error(`Unsupported version '${version}' for mos '${resourceName}'`);

    switch (version) {
      case 'v1': {
        artifacts = parseMosV1({
          reader,
          resourceName,
        });
        break;
      }
      case 'v2': {
        artifacts = parseMosV2({
          reader,
          resourceName,
          pvrzRgbaIndex,
        });
        break;
      }
    }

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'mos_raw2json',
      params: {
        version: artifacts.mos.header.version,
        resourceName,
        variant: artifacts.mos.variant,
      },
    });

    return artifacts;
  },
);
