import { nothing } from '@planar/shared';
import type { LogPercent } from '../shared/types.js';
import type { Maybe } from '@planar/shared';

type Resource = Readonly<{
  resourceName: string;
}>;

const iterate = <TIn, TOut extends Resource>(
  items: TIn[],
  parse: (item: TIn, i: number) => Promise<TOut>,
  percentCallback: Maybe<LogPercent> = nothing(),
): AsyncIterableIterator<TOut> => {
  let i = 0;

  const iterator: AsyncIterableIterator<TOut> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<TOut>> {
      if (i >= items.length) {
        return { done: true, value: undefined };
      }

      const item = await parse(items[i]!, i);

      const percent = Math.round((i + 1) * 100 / items.length);
      percentCallback?.(percent, item?.resourceName);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default iterate;
