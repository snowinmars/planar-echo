import { extend } from '../../../../pipes/offsetMap.js';

/* createGenerator().register().enum('spellTypeV10',
 *   ['priest','wizard','innate']
 * ).write();
 */
const spellTypeV10 = {
  0: 'priest',
  1: 'wizard',
  2: 'innate',
} as const;
type SpellTypeV10 = typeof spellTypeV10[keyof typeof spellTypeV10];

export const offsetMap = {
  spellType: extend(spellTypeV10),
};

export type KnownSpellV10 = Readonly<{
  resourceName: string;
  previousSpellLevel: number;
  spellType: SpellTypeV10;
}>;
