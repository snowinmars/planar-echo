import { extendMap } from './4.parseMemorizedSpellsTableV10.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawCreMemorizedSpellV10 } from './4.parseMemorizedSpellsTableV10.types.js';

const parse = (reader: BufferReader): RawCreMemorizedSpellV10 => {
  const spell = reader.string(8);
  const memorization = reader.map.uint(extendMap.memorization.parseFlags);

  return {
    spell,
    memorization,
  };
};

type ParseMemorizedSpellsTableV10Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseMemorizedSpellsTableV10 = ({
  reader,
  count,
}: ParseMemorizedSpellsTableV10Props): RawCreMemorizedSpellV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreMemorizedSpellV10>({ length: count }, () => parse(r));
};
