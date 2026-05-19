import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('memorisedV10', {
 *   byte1: ['Memorised','Disabled'],
 * }).write();
 */
const memorizationV10 = {
  // byte1
  0x1: 'Memorised',
  0x2: 'Disabled',
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type MemorizationV10 = typeof memorizationV10[keyof typeof memorizationV10];

export const extendMap = {
  memorization: extend(memorizationV10),
};

export type MemorizedSpellV10 = Readonly<{
  spell: string;
  memorization: MemorizationV10[];
}>;
