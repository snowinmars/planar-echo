import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseCreV10 } from './v10/parseCreV10.js';
import { parseCreV11 } from './v11/parseCreV11.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawIds } from '../ids/index.js';
import type { RawCre } from './parseCres.types.js';

export const parseCres = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
  ids: Map<string, RawIds>,
): AsyncIterableIterator<RawCre> => iterate<DecompiledBiff, RawCre>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'cre') throw new Error(`Unsupported signature '${signature}' for cre '${resourceName}'`);
    if (version !== 'v1.0' && version !== 'v1.1' && version !== 'v1.2' && version !== 'v2.2' && version !== 'v9.0') throw new Error(`Unsupported version '${version}' for cre '${resourceName}'`);

    switch (version) {
      case 'v1.0': {
        const cre = parseCreV10({
          reader,
          ids,
          resourceName,
        });

        const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
        reportProgress({
          value: percent,
          step: 'cre_raw2json',
          params: { resourceName },
        });

        return cre;
      }
      case 'v1.1': {
        const cre = parseCreV11({
          reader,
          ids,
          resourceName,
        });

        const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
        reportProgress({
          value: percent,
          step: 'cre_raw2json',
          params: { resourceName },
        });

        return cre;
      }
      case 'v1.2':
      case 'v2.2':
      case 'v9.0': throw new Error(`Not implemented '${version}', file '${resourceName}'`);
      default: throw new Error('Should not happen');
    }
  },
);
