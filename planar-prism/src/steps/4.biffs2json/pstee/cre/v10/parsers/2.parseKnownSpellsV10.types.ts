import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().enum('typeV10',
 *   ['priest','wizard','innate']
 * ).write();
 */
const typeV10 = {
  0: 'priest',
  1: 'wizard',
  2: 'innate',
} as const;
type TypeV10 = typeof typeV10[keyof typeof typeV10];

export const extendMap = {
  type: extend(typeV10),
};

export type KnownSpellV10 = Readonly<{
  spell: string;
  level: number;
  type: TypeV10;
}>;
