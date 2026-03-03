import { join } from 'path';
import { readFile } from 'fs/promises';
import type { DecompiledItem, GameName, Pathes } from '../../shared/types.js';
import type { TlkEntry } from '../convertTlk/types.js';
import type { Ids } from './patches/readIdsBufferTypes.js';
import readIdsBuffer from './patches/readIdsBuffer.js';

const readIdsFile = async (filePath: string, resourceName: string, gameName: GameName, tlk: TlkEntry): Promise<Ids> => {
  const buffer = await readFile(filePath);

  const raw = await readIdsBuffer(buffer, resourceName, gameName);

  return raw;
};

const convertIds = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  tlk: TlkEntry,
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): AsyncIterableIterator<Ids> => {
  let i = 0;

  const iterator: AsyncIterableIterator<Ids> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<Ids>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readIdsFile(
        join(pathes.output.decimpiledBiff, decompiledItem.name),
        decompiledItem.name,
        pathes.gameName,
        tlk,
      );

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      percentCallback?.(percent, item.resourceName);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default convertIds;
