import { offsetMap } from '../../v10.types/4.memorizedSpell.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Signature, Versions } from '../../types.js';
import type { Meta } from '../../../types.js';
import type { MemorizedSpellV10 } from '../../v10.types/4.memorizedSpell.js';

const parse = (reader: BufferReader): MemorizedSpellV10 => {
  const resourceName = reader.string(8);
  const memorised = reader.map.uint(offsetMap.memorised.parseFlags);

  return {
    resourceName,
    memorised,
  };
};

const parseMemorizedSpellsTableV10 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): MemorizedSpellV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const memorizedSpellSize = 12;
  return Array.from<never, MemorizedSpellV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * memorizedSpellSize)));
};

export default parseMemorizedSpellsTableV10;
