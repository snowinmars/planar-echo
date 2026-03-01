import { join } from 'path';
import { readFile } from 'fs/promises';
import readItemBuffer from './patches/readItemBuffer.js';
import type { DecompiledItem, GameName, Pathes } from '../../shared/types.js';
import type { ItemV10, ItemV11, ItemV20 } from './patches/readItemBufferTypes.js';
import type { TlkEntry } from '../convertTlk/types.js';

const readItemFile = async (filePath: string, resourceName: string, gameName: GameName, tlk: TlkEntry): Promise<ItemV10 | ItemV11 | ItemV20> => {
  const buffer = await readFile(filePath);

  const raw = await readItemBuffer(buffer, resourceName, gameName);

  return raw;
};

const convertItm = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  tlk: TlkEntry,
  percentCallback: ((percent: number) => void) | null = null,
): AsyncIterableIterator<(ItemV10 | ItemV11 | ItemV20)> => {
  let i = 0;

  const iterator: AsyncIterableIterator<(ItemV10 | ItemV11 | ItemV20)> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<(ItemV10 | ItemV11 | ItemV20)>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readItemFile(
        join(pathes.output.decimpiledBiff, decompiledItem.name),
        decompiledItem.name,
        pathes.gameName,
        tlk,
      );

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      percentCallback?.(percent);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default convertItm;
