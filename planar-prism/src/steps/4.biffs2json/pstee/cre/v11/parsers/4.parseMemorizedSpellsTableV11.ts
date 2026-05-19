import { extendMap } from './4.parseMemorizedSpellsTableV11.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { MemorizedSpellV11 } from './4.parseMemorizedSpellsTableV11.types.js';

const parse = (reader: BufferReader): MemorizedSpellV11 => {
  const spell = reader.string(8);
  const memorization = reader.map.uint(extendMap.memorization.parseFlags);

  return {
    spell,
    memorization,
  };
};

type ParseMemorizedSpellsTableV11Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseMemorizedSpellsTableV11 = ({
  reader,
  count,
}: ParseMemorizedSpellsTableV11Props): MemorizedSpellV11[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const memorizedSpellSize = 12;
  return Array.from<never, MemorizedSpellV11>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * memorizedSpellSize)));
};
