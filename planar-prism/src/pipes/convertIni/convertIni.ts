const convertIni = (
  pathes: Pathes,
  decompiledItems: DecompiledItem[],
  percentCallback: ((percent: number, resource: string) => void) | null = null,
): AsyncIterableIterator<Ini> => {
  let i = 0;

  const iterator: AsyncIterableIterator<Ini> = {
    [Symbol.asyncIterator]() {
      return this;
    },

    async next(): Promise<IteratorResult<Ini>> {
      if (i >= decompiledItems.length) {
        return { done: true, value: undefined };
      }

      const decompiledItem = decompiledItems[i]!;
      const item = await readIniFile(
        join(pathes.output.decimpiledBiff.root, decompiledItem.name),
        decompiledItem.name,
      );

      const percent = Math.round((i + 1) * 100 / decompiledItems.length);
      percentCallback?.(percent, item.resourceName);

      i++;
      return { done: false, value: item };
    },
  };

  return iterator;
};

export default convertIni;
