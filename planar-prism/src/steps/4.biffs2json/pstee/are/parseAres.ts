import { readFile } from 'fs/promises';
import { join } from 'path';

import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { parseAreV10 } from './v1.0/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';

import type { RawIds } from '../ids/index.js';
import type { RawAre } from './parseAres.types.js';

type ParseAresProps = Readonly<{
  paths: Paths;
  decompiledBiffs: DecompiledBiff[];
  creNames: ReadonlySet<string>;
  ids: Map<string, RawIds>;
}>;
export const parseAres = ({
  paths,
  decompiledBiffs,
  creNames,
  ids,
}: ParseAresProps): AsyncIterableIterator<RawAre> => iterate<DecompiledBiff, RawAre>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'area') throw new Error(`Unsupported signature '${signature}' for are resource '${resourceName}'`);
    if (version !== 'v1.0') throw new Error(`Not implemented '${version}' for resource '${resourceName}'`);

    const are = parseAreV10({
      reader,
      resourceName,
      creNames,
      ids,
    });

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'are_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return are;
  },
);
