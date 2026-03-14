import { offsetMap } from '../../v10.types/3.spellMemorizationInfo.js';

import type { BufferReader } from '../../../../../pipes/readers.js';
import type { Signature, Versions } from '../../types.js';
import type { Meta } from '../../../types.js';
import type { SpellMemorizationInfoPsteeV10, SpellMemorizationInfoV10 } from '../../v10.types/3.spellMemorizationInfo.js';

type SpellMemorizationInfo = SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10;

const parsePsteeV10 = (reader: BufferReader): SpellMemorizationInfoPsteeV10 => {
  const spellRef = reader.string(8);
  const memoraization = reader.ushort();
  reader.skip.ushort();

  return {
    spellRef,
    memoraization,
  };
};

const parseNonPsteeV10 = (reader: BufferReader): SpellMemorizationInfoV10 => {
  const spellLevel = reader.short();
  const numberOfSpellsMemorizable = reader.short();
  const numberOfSpellsMemorizableAfterEffects = reader.short();
  const spellType = reader.map.short(offsetMap.spellType.parse);
  const indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel = reader.uint();
  const countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel = reader.uint();

  return {
    spellLevel,
    numberOfSpellsMemorizable,
    numberOfSpellsMemorizableAfterEffects,
    spellType,
    indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel,
    countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel,
  };
};

const parseSpellMemorizationInfosV10 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): SpellMemorizationInfo[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const spellMemorizationInfoSize = meta.isPstee ? 12 : 16; // TODO [snow]: lol, how?
  const parse = meta.isPstee ? parsePsteeV10 : parseNonPsteeV10;
  return Array.from<never, SpellMemorizationInfo>({ length: count }, (_, i) => parse(reader.fork(reader.offset + i * spellMemorizationInfoSize)));
};

export default parseSpellMemorizationInfosV10;
