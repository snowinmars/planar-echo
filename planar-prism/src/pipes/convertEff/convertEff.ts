import { join } from 'path';
import { readFile } from 'fs/promises';
import readEffectBuffer from './patches/readEffectBuffer.js';
import type { DecompiledItem, GameName, Pathes } from '../../shared/types.js';
import type { EffectV10, EffectV20 } from './patches/readEffectBufferTypes.js';
import type { TlkEntry } from '../convertTlk/types.js';

type Effect = EffectV10 | EffectV20;

const readEffectFile = async (filePath: string, resourceName: string, gameName: GameName, tlk: TlkEntry): Promise<Effect> => {
  const buffer = await readFile(filePath);

  const raw = await readEffectBuffer(buffer, resourceName, gameName);

  return raw;
};

const convertEff = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  tlk: TlkEntry,
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): AsyncIterableIterator<(Effect)> => {
  let i = 0;

  const iterator: AsyncIterableIterator<Effect> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<Effect>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readEffectFile(
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

export default convertEff;
