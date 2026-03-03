import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type MemorizedSpellV10 } from './readMemorizedSpellsTableTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

const readMemorizedSpellV10 = (reader: BufferReader, meta: CreatureMeta): MemorizedSpellV10 => {
  const tmp: PartialWriteable<MemorizedSpellV10> = {};

  tmp.resourceName = reader.string(8);
  tmp.memorised = reader.map.short(offsetMap.memorised.parseFlags);

  return {
    resourceName: tmp.resourceName,
    memorised: tmp.memorised,
  };
};

const readMemorizedSpellsTableV10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): MemorizedSpellV10[] => {
  const memorizedSpellSize = 12;
  const memorizedSpells: MemorizedSpellV10[] = [];
  for (let i = 0; i < header.memorizedSpellsCount; i++) {
    const offset = header.memorizedSpellsOffset + i * memorizedSpellSize;
    const MemorizedSpell = readMemorizedSpellV10(reader.fork(offset), meta);
    memorizedSpells.push(MemorizedSpell);
  }

  return memorizedSpells;
};

export default readMemorizedSpellsTableV10;
