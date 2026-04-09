import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/pipes/readers.js';
import parseItmV10 from './v10/parseItmV10.js';
import parseItmV11 from './v11/parseItmV11.js';
import parseItmV20 from './v20/parseItmV20.js';
import createMeta from '../meta.js';

import type { Maybe } from '@planar/shared';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import { reportProgress } from '@/shared/report.js';
import type { Ids } from '../ids/index.js';
import type { ItmV10, ItmV11, ItmV20, Signature, Versions } from './types.js';
import type { Meta } from '../types.js';

type Itm = ItmV10 | ItmV11 | ItmV20;

const detectVersionToUse = (meta: Meta<Signature, Versions>): Versions => {
  if (meta.version === 'v11' || (meta.version === 'v1' && meta.isPstee)) return 'v11';
  if (meta.version === 'v1') return 'v1';
  if (meta.version === 'v20') return 'v20';
  throw new Error(`Cannot detect version to use for ${JSON.stringify(meta)}`);
};

const parseItm = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  ids: Map<string, Ids>,
): AsyncIterableIterator<Itm> => iterate<DecompiledBiff, Itm>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;
    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));

    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'itm') throw new Error(`Unsupported signature '${signature}' for item '${resourceName}'`);
    if (version !== 'v1' && version !== 'v11' && version !== 'v20') throw new Error(`Unsupported version '${version}' for item '${resourceName}'`);

    const meta = createMeta<Signature, Versions>({
      signature,
      version,
      resourceName,
      gameName: pathes.gameName,
      ids,
    });
    const versionToUse = detectVersionToUse(meta);

    switch (versionToUse) {
      case 'v1': {
        const itm = parseItmV10(reader, meta);

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'parseItm',
          params: {
            version: meta.version,
            resourceName,
          },
        });

        return itm;
      }
      case 'v11': {
        const itm = parseItmV11(reader, meta);

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'parseItm',
          params: {
            version: meta.version,
            resourceName,
          },
        });

        return itm;
      }
      case 'v20': {
        const itm = parseItmV20(reader, meta);

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'parseItm',
          params: {
            version: meta.version,
            resourceName,
          },
        });

        return itm;
      }
      default:throw new Error('Should not happens');
    }
  },
);

export default parseItm;
