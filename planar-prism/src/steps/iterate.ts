const iterate = <TIn, TOut>(
  items: TIn[],
  action: (item: TIn, i: number) => Promise<TOut>,
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

      const item = await action(items[i]!, i);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default iterate;
