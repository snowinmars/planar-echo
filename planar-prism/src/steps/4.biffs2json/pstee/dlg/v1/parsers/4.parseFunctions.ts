import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawFunction } from './4.parseFunctions.types.js';

const parse = (reader: BufferReader, index: number): RawFunction => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const offset = reader.uint();
  const length = reader.uint();
  const text   = reader.fork(offset).string(length);
  /* eslint-enable */

  return {
    index,
    offset,
    length,
    text,
  };
};

type ParseFunctionProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseFunction = ({
  reader,
  count,
}: ParseFunctionProps): Map<number, RawFunction> => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm

  const knownFunctionSize = 8;
  return Array.from({ length: count })
    .map((_, i) => i)
    .reduce((map, index) => {
      const f = parse(reader.fork(reader.offset + index * knownFunctionSize), index);
      map.set(index, f);
      return map;
    }, new Map<number, RawFunction>());
};
