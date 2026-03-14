import { nothing } from '../shared/maybe.js';
import type { DecompiledBiff } from './3.decompileBiffs/index.js';
import type { LogPercent } from '../shared/types.js';
import type { Maybe } from '../shared/maybe.js';

type Resource = Readonly<{
  resourceName: string;
}>;

const iterate = <TParsed extends Resource>(
  decompiledBiffs: DecompiledBiff[],
  parse: (decompiledBiff: DecompiledBiff) => Promise<TParsed>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<TParsed> => {
  let i = 0;

  const iterator: AsyncIterableIterator<TParsed> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<TParsed>> {
      if (i >= decompiledBiffs.length) {
        return { done: true, value: undefined };
      }

      const decompiledBiff = decompiledBiffs[i]!;
      const item = await parse(decompiledBiff);

      const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
      percentCallback?.(percent, item.resourceName);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default iterate;
