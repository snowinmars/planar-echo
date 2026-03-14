import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type { RawFunction } from '../../v1.types/4.function.js';

const parse = (reader: BufferReader, index: number): RawFunction => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const off  = reader.uint();
  const len  = reader.uint();
  const text = reader.fork(off).string(len);
  /* eslint-enable */

  return {
    index,
    offset: off,
    length: len,
    text,
  };
};

const parseFunction = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): Map<number, RawFunction> => {
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

export default parseFunction;
