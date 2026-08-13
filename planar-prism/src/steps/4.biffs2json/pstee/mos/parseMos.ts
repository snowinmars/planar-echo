import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseMosV1 } from './v1/parseMosV1.js';
import { parseMosV2 } from './v2/parseMosV2.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RgbaImage } from '../pvrz/decode/index.js';
import type { ParsedMosV1Artifacts, ParsedMosV2Artifacts } from './parseMos.types.js';

type ParsedMosArtifacts = ParsedMosV1Artifacts | ParsedMosV2Artifacts;
type ParseMosProps = Readonly<{
  paths: Paths;
  decompiledItems: DecompiledBiff[];
  pvrzRgbaIndex: Map<string, RgbaImage>;
}>;
export const parseMos = ({
  paths,
  decompiledItems,
  pvrzRgbaIndex,
}: ParseMosProps): AsyncIterableIterator<ParsedMosArtifacts> => iterate<DecompiledBiff, ParsedMosArtifacts>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);
    const signature = reader.string(4);
    const version = reader.string(4);

    let artifacts: ParsedMosArtifacts;

    if (signature !== 'mos') throw new Error(`Unsupported signature '${signature}' for item '${resourceName}'`);
    if (version !== 'v1' && version !== 'v2') throw new Error(`Unsupported version '${version}' for item '${resourceName}'`);

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

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
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
