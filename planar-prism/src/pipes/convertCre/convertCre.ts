import { join } from 'path';
import { readFile } from 'fs/promises';
import type { DecompiledItem, GameName, Pathes } from '../../shared/types.js';
import type { TlkEntry } from '../convertTlk/types.js';
import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from './patches/readCreatureBufferTypes.js';
import readCreatureBuffer from './patches/readCreatureBuffer.js';
import type { Ids } from '../convertIds/patches/readIdsBufferTypes.js';
import patchTranslation from './patches/patchTranslation.js';

type Creature = CreatureV10 | CreatureV12 | CreatureV22 | CreatureV90;

const readCreatureFile = async (filePath: string, resourceName: string, gameName: GameName, tlk: TlkEntry, ids: Ids[]): Promise<Creature> => {
  const buffer = await readFile(filePath);

  const raw = await readCreatureBuffer(buffer, resourceName, gameName, ids);
  const translated = patchTranslation(raw, tlk);

  return translated;
};

const convertCre = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  tlk: TlkEntry,
  ids: Ids[],
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): AsyncIterableIterator<Creature> => {
  let i = 0;

  const iterator: AsyncIterableIterator<Creature> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<Creature>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readCreatureFile(
        join(pathes.output.decimpiledBiff, decompiledItem.name),
        decompiledItem.name,
        pathes.gameName,
        tlk,
        ids,
      );

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      percentCallback?.(percent, item?.resourceName); // TODO [snow]: remove elvis after versions are done

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default convertCre;
