import { extendMap } from './2.parseKnownSpellsV11.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawCreKnownSpellV11 } from './2.parseKnownSpellsV11.types.js';

const parse = (reader: BufferReader): RawCreKnownSpellV11 => {
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
}: ParseKnownSpellsV11Props): RawCreKnownSpellV11[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreKnownSpellV11>({ length: count }, () => parse(r));
};
