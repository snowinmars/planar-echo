import { offsetMap } from '../../v10.types/3.spellMemorizationInfo.js';

import type { BufferReader } from '@/pipes/readers.js';
import type { Meta } from '../../../types.js';
import type { Signature, Versions } from '../../types.js';
import type {
  SpellMemorizationInfoPsteeV10,
  SpellMemorizationInfoV10,
} from '../../v10.types/3.spellMemorizationInfo.js';

type SpellMemorizationInfo = SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10;

// const parsePsteeV10 = (reader: BufferReader): SpellMemorizationInfoPsteeV10 => {
//   const spellRef = reader.string(8);
//   const memoraization = reader.ushort();
//   reader.skip.ushort();

//   return {
//     spellRef,
//     memoraization,
//   };
// };

const parseNonPsteeV10 = (reader: BufferReader): SpellMemorizationInfoV10 => {
  const spellLevel = reader.short();
  const numberOfSpellsMemorizable = reader.short();
  const numberOfSpellsMemorizableAfterEffects = reader.short();
  const spellType = reader.map.short(offsetMap.spellType.parse);
  const spellTableIndex = reader.uint();
  const spellsCount = reader.int();

  return {
    spellLevel,
    numberOfSpellsMemorizable,
    numberOfSpellsMemorizableAfterEffects,
    spellType,
    spellTableIndex,
    spellsCount,
  };
};

const parseSpellMemorizationInfosV10 = (reader: BufferReader, count: number, meta: Meta<Signature, Versions>): SpellMemorizationInfo[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  // const spellMemorizationInfoSize = meta.isPstee ? 12 : 16; // TODO [snow]: lol, how?
  // const parse = meta.isPstee ? parsePsteeV10 : parseNonPsteeV10;
  const spellMemorizationInfoSize = 16;
  return Array.from<never, SpellMemorizationInfo>({ length: count }, (_, i) => parseNonPsteeV10(reader.fork(reader.offset + i * spellMemorizationInfoSize)));
};

export default parseSpellMemorizationInfosV10;
