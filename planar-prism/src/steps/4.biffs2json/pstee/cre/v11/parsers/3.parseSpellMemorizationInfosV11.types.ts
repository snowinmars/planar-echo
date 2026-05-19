import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().enum('spellTypeV11',
 *   ['priest','wizard','innate']
 * ).write();
 */
const spellTypeV11 = {
  0: 'priest',
  1: 'wizard',
  2: 'innate',
};
type SpellTypeV11 = typeof spellTypeV11[keyof typeof spellTypeV11];

export const extendMap = {
  spellType: extend(spellTypeV11),
};

export type SpellMemorizationInfoV11 = Readonly<{
  spellLevel: number;
  memorizableSpellsCount: number;
  memorizableSpellsAfterEffectsCount: number;
  spellType: SpellTypeV11;
  spellTableIndex: number;
  spellsCount: number;
}>;

export type SpellMemorizationInfoPsteeV11 = Readonly<{
  spellRef: string;
  memoraization: number;
}>;
