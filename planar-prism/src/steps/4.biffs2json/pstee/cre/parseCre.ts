import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/shared/bufferReader.js';
import { reportProgress } from '@/shared/report.js';
import { parseCreaturesV10 } from './v10/parseCreaturesV10.js';
import { parseCreaturesV11 } from './v11/parseCreaturesV11.js';

import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Ids } from '../ids/index.js';
import type { CreatureV10, CreatureV11 } from './types.js';

type Creature = CreatureV10 | CreatureV11;

export const parseCre = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
): AsyncIterableIterator<Creature> => iterate<DecompiledBiff, Creature>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.ghostDir.decimpiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'cre') throw new Error(`Unsupported signature '${signature}' for creature`);
    if (version !== 'v1.0' && version !== 'v1.1' && version !== 'v1.2' && version !== 'v2.2' && version !== 'v9.0') throw new Error(`Unsupported version '${version}' for creature`);

    switch (version) {
      case 'v1.0': {
        const cre = parseCreaturesV10({
          reader,
          ids,
          resourceName,
        });

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'cre_raw2json',
          params: {
            version: version,
            resourceName,
          },
        });

        return cre;
      }
      case 'v1.1': {
        const cre = parseCreaturesV11({
          reader,
          ids,
          resourceName,
        });

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'cre_raw2json',
          params: {
            version: version,
            resourceName,
          },
        });

        return cre;
      }
      case 'v1.2': {
        throw new Error(`Not implemented v1.2, file '${resourceName}'`);
      }
      case 'v2.2': {
        throw new Error(`Not implemented v2.2, file '${resourceName}'`);
      }
      case 'v9.0': {
        throw new Error(`Not implemented v9.0, file '${resourceName}'`);
      }
      default: throw new Error('Should not happen');
    }
  },
);
