import { join } from 'path';
import { readFile } from 'fs/promises';
import { nothing } from '@planar/shared';
import iterate from '@/steps/iterate.js';
import { createReader } from '@/pipes/readers.js';
import { reportProgress } from '@/shared/report.js';
import createMeta from '../meta.js';
import parseCreaturesV10FromBuffer from './v10/parseCreaturesV10FromBuffer.js';

import type { Maybe } from '@planar/shared';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { Pathes } from '@/steps/1.createPathes/index.js';
import type { LogPercent } from '@/shared/types.js';
import type { Ids } from '../ids/index.js';
import type { Tlk } from '../tlk/index.js';
import type {
  CreatureV10,
  CreatureV12,
  CreatureV22,
  CreatureV90,
  Signature,
  Versions,
} from './types.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;

const parseCre = (
  pathes: Pathes,
  decompiledItems: DecompiledBiff[],
  tlk: Tlk,
  ids: Map<string, Ids>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<Creature> => iterate<DecompiledBiff, Creature>(
  decompiledItems,
  async (decompiledItem, i) => {
    const resourceName = decompiledItem.resourceName;

    const buffer = await readFile(join(pathes.output.decimpiledBiff.root, resourceName));
    const reader = createReader(buffer);

    const signature = reader.string(4);
    const version = reader.string(4);

    if (signature !== 'cre') throw new Error(`Unsupported signature '${signature}' for creature`);
    if (version !== 'v1.0' && version !== 'v1.1' && version !== 'v1.2' && version !== 'v2.2' && version !== 'v9.0') throw new Error(`Unsupported version '${version}' for creature`);

    const meta = createMeta<Signature, Versions>({
      signature: 'cre',
      version,
      resourceName,
      gameName: pathes.gameName,
      ids,
    });

    switch (meta.version) {
      case 'v1.0': {
        const cre = parseCreaturesV10FromBuffer(reader, meta);

        const percent = Math.round((i + 1) * 100 / decompiledItems.length);
        reportProgress({
          value: percent,
          step: 'parseCre',
          params: {
            version: meta.version,
            resourceName,
          },
        });

        return cre;
      }
      case 'v1.1': {
        return null as unknown as Creature;
        throw new Error('Not implemented v1.1');
      }
      case 'v1.2': {
        return null as unknown as Creature;
        throw new Error('Not implemented v1.2');
      }
      case 'v2.2': {
        return null as unknown as Creature;
        throw new Error('Not implemented v2.2');
      }
      case 'v9.0': {
        return null as unknown as Creature;
        throw new Error('Not implemented v9.0');
      }
      default: throw new Error('Should not happen');
    }
  },
  percentCallback,
);

export default parseCre;
