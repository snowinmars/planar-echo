import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type KnownSpellV10 } from './readKnownSpellsTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

const readKnownSpellV10 = (reader: BufferReader, meta: CreatureMeta): KnownSpellV10 => {
  const tmp: PartialWriteable<KnownSpellV10> = {};

  tmp.resourceName = reader.string(8);
  tmp.previousSpellLevel = reader.short();
  tmp.spellType = reader.map.short(offsetMap.spellType.parse);

  return {
    resourceName: tmp.resourceName,
    previousSpellLevel: tmp.previousSpellLevel,
    spellType: tmp.spellType,
  };
};

const readKnownSpellsV10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): KnownSpellV10[] => {
  const knownSpellSize = 12;
  const knownSpells: KnownSpellV10[] = [];
  for (let i = 0; i < header.knownSpellsCount; i++) {
    const offset = header.knownSpellsOffset + i * knownSpellSize;
    const knownSpell = readKnownSpellV10(reader.fork(offset), meta);
    knownSpells.push(knownSpell);
  }

  return knownSpells;
};

export default readKnownSpellsV10;
