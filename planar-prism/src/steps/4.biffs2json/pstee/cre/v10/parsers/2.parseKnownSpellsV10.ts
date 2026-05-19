import { extendMap } from './2.parseKnownSpellsV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { KnownSpellV10 } from './2.parseKnownSpellsV10.types.js';

const parse = (reader: BufferReader): KnownSpellV10 => {
  const spell = reader.string(8);
  const level = reader.short();
  const type = reader.map.short(extendMap.type.parse);

  return {
    spell,
    level,
    type,
  };
};

type ParseKnownSpellsV10Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseKnownSpellsV10 = ({
  reader,
  count,
}: ParseKnownSpellsV10Props): KnownSpellV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const knownSpellSize = 12;
  return Array.from<never, KnownSpellV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownSpellSize)));
};
