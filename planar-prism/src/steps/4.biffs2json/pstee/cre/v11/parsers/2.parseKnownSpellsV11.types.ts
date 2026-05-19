import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().enum('typeV11',
 *   ['priest','wizard','innate']
 * ).write();
 */
const typeV11 = {
  0: 'priest',
  1: 'wizard',
  2: 'innate',
} as const;
type TypeV11 = typeof typeV11[keyof typeof typeV11];

export const extendMap = {
  type: extend(typeV11),
};

export type KnownSpellV11 = Readonly<{
  spell: string;
  level: number;
  type: TypeV11;
}>;
