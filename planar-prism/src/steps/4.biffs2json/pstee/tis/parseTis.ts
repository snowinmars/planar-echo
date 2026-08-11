import { join, parse as parsePath } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseTisV1 } from './v1/parseTisV1.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Wed } from '../wed/index.js';
import type { RgbaImage } from '../pvrz/decode/index.js';
import type { ParsedTisArtifacts } from './v1/parseTisV1.types.js';

type ParseTisProps = Readonly<{
  paths: Paths;
  decompiledItems: DecompiledBiff[];
  wedIndex: Map<string, Wed>;
  pvrzRgbaIndex: Map<string, RgbaImage>;
}>;
export const parseTis = ({
  paths,
  decompiledItems,
  wedIndex,
  pvrzRgbaIndex,
}: ParseTisProps): AsyncIterableIterator<ParsedTisArtifacts> => iterate<DecompiledBiff, ParsedTisArtifacts>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'tis') throw new Error(`Unsupported signature '${signature}' for tis resource '${resourceName}'`);
    if (version !== 'v1') throw new Error(`Unsupported version '${version}' for tis resource '${resourceName}'`);

    const artifacts = parseTisV1({
      resourceName,
      reader,
      wedIndex,
      pvrzRgbaIndex,
    });

    const percent = Math.round((i + 1) * 100 / decompiledItems.length);
    reportProgress({
      value: percent,
      step: 'tis_raw2json',
      params: {
        version,
        resourceName,
        variant: artifacts.tis.variant,
        atlasWidthSource: artifacts.tis.atlasWidthSource,
        tisResRef: parsePath(resourceName).name,
      },
    });

    return artifacts;
  },
);
