import { extendMap } from './2.parseKnownSpellsV11.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { KnownSpellV11 } from './2.parseKnownSpellsV11.types.js';

const parse = (reader: BufferReader): KnownSpellV11 => {
  const spell = reader.string(8);
  const level = reader.short();
  const type = reader.map.short(extendMap.type.parse);

  return {
    spell,
    level,
    type,
  };
};

type ParseKnownSpellsV11Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseKnownSpellsV11 = ({
  reader,
  count,
}: ParseKnownSpellsV11Props): KnownSpellV11[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const knownSpellSize = 12;
  return Array.from<never, KnownSpellV11>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownSpellSize)));
};
