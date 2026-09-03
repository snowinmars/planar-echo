import { extendMap } from './3.parseSpellMemorizationInfosV11.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type {
  RawCreSpellMemorizationInfoV11,
} from './3.parseSpellMemorizationInfosV11.types.js';

const parse = (reader: BufferReader): RawCreSpellMemorizationInfoV11 => {
  const spellLevel = reader.short();
  const memorizableSpellsCount = reader.short();
  const memorizableSpellsAfterEffectsCount = reader.short();
  const spellType = reader.map.short(extendMap.spellType.parse);
  const spellTableIndex = reader.uint();
  const spellsCount = reader.int();

  return {
    spellLevel,
    memorizableSpellsCount,
    memorizableSpellsAfterEffectsCount,
    spellType,
    spellTableIndex,
    spellsCount,
  };
};

type ParseSpellMemorizationInfosV11Props = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseSpellMemorizationInfosV11 = ({
  reader,
  count,
}: ParseSpellMemorizationInfosV11Props): RawCreSpellMemorizationInfoV11[] => {
  // https://gibberlings3.github.io/iesdp/file_formats/ie_formats/cre_v1.htm

  const r = reader.fork();
  return Array.from<never, RawCreSpellMemorizationInfoV11>({ length: count }, () => parse(r));
};
