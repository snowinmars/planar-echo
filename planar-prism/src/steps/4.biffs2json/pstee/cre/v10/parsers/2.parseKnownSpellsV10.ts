import { extendMap } from './2.parseKnownSpellsV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawCreKnownSpellV10 } from './2.parseKnownSpellsV10.types.js';

const parse = (reader: BufferReader): RawCreKnownSpellV10 => {
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
}: ParseKnownSpellsV10Props): RawCreKnownSpellV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreKnownSpellV10>({ length: count }, () => parse(r));
};
