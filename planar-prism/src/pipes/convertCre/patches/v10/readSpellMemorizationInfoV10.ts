import type { BufferReader } from '../../../../pipes/readers.js';
import type { CreatureMeta } from '../readCreatureBufferTypes.js';
import { offsetMap, type SpellMemorizationInfoPsteeV10, type SpellMemorizationInfoV10 } from './readSpellMemorizationInfoTypesV10.js';
import type { PartialWriteable } from '../../../../shared/types.js';
import type { CreatureHeaderV10 } from './readHeaderTypesV10.js';

type SpellMemorizationInfo = SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10;

const readSpellMemorizationInfoPsteeV10 = (reader: BufferReader, meta: CreatureMeta): SpellMemorizationInfoPsteeV10 => {
  const tmp: PartialWriteable<SpellMemorizationInfoPsteeV10> = {};

  tmp.spellRef = reader.string(8);
  tmp.memoraization = reader.ushort();
  reader.skip.ushort();

  return {
    spellRef: tmp.spellRef!,
    memoraization: tmp.memoraization!,
  };
};

const readSpellMemorizationInfoOtherV10 = (reader: BufferReader, meta: CreatureMeta): SpellMemorizationInfoV10 => {
  const tmp: PartialWriteable<SpellMemorizationInfoV10> = {};
  tmp.spellLevel = reader.short();
  tmp.numberOfSpellsMemorizable = reader.short();
  tmp.numberOfSpellsMemorizableAfterEffects = reader.short();
  tmp.spellType = reader.map.short(offsetMap.spellType.parse);
  tmp.indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel = reader.uint();
  tmp.countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel = reader.uint();

  return {
    spellLevel: tmp.spellLevel,
    numberOfSpellsMemorizable: tmp.numberOfSpellsMemorizable,
    numberOfSpellsMemorizableAfterEffects: tmp.numberOfSpellsMemorizableAfterEffects,
    spellType: tmp.spellType,
    indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel: tmp.indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel,
    countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel: tmp.countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel,
  };
};

const readSpellMemorizationInfoV10 = (reader: BufferReader, meta: CreatureMeta): SpellMemorizationInfo => {
  if (meta.isPstee) {
    return readSpellMemorizationInfoPsteeV10(reader, meta);
  }

  return readSpellMemorizationInfoOtherV10(reader, meta);
};

const readSpellMemorizationInfosV10 = (reader: BufferReader, header: CreatureHeaderV10, meta: CreatureMeta): SpellMemorizationInfo[] => {
  const spellMemorizationInfoSize = meta.isPstee ? 12 : 16; // TODO [snow]: lol, how?
  const spellMemorizationInfos: SpellMemorizationInfo[] = [];
  for (let i = 0; i < header.memorizedSpellsCount; i++) {
    const offset = header.memorizedSpellsOffset + i * spellMemorizationInfoSize;
    const knownSpell = readSpellMemorizationInfoV10(reader.fork(offset), meta);
    spellMemorizationInfos.push(knownSpell);
  }

  return spellMemorizationInfos;
};

export default readSpellMemorizationInfosV10;
