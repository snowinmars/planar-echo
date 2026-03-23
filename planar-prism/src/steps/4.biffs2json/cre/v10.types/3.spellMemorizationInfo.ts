import { extend } from '@/pipes/offsetMap.js';

/* createGenerator().register().enum('spellTypeV10',
 *   ['priest','wizard','innate']
 * ).write();
 */
const spellTypeV10 = {
  0: 'priest',
  1: 'wizard',
  2: 'innate',
};
type SpellTypeV10 = typeof spellTypeV10[keyof typeof spellTypeV10];

export const offsetMap = {
  spellType: extend(spellTypeV10),
};

export type SpellMemorizationInfoV10 = Readonly<{
  spellLevel: number;
  numberOfSpellsMemorizable: number;
  numberOfSpellsMemorizableAfterEffects: number;
  spellType: SpellTypeV10;
  indexIntoMemorizedSpellsArrayOfFirstMemorizedSpellOfThisTypeInThisLevel: number;
  countOfMemorizedSpellEntriesInMemorizedSpellsArrayOfMemorizedSpellsOfThisTypeInThisLevel: number;
}>;

export type SpellMemorizationInfoPsteeV10 = Readonly<{
  spellRef: string;
  memoraization: number;
}>;
