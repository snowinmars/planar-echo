import { offsetMap } from '../../v10.types/2.knownSpell.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { KnownSpellV10 } from '../../v10.types/2.knownSpell.js';
import type { Signature, Versions } from '../../types.js';
import type { Meta } from '../../../types.js';

const parse = (reader: BufferReader): KnownSpellV10 => {
  const resourceName = reader.string(8);
  const previousSpellLevel = reader.short();
  const spellType = reader.map.short(offsetMap.spellType.parse);

  return {
    resourceName,
    previousSpellLevel,
    spellType,
  };
};

const parseKnownSpellsV10 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): KnownSpellV10[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const knownSpellSize = 12;
  return Array.from<never, KnownSpellV10>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * knownSpellSize)));
};

export default parseKnownSpellsV10;
