import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('memorisedV11', {
 *   byte1: ['Memorised','Disabled'],
 * }).write();
 */
const memorizationV11 = {
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
type MemorizationV11 = typeof memorizationV11[keyof typeof memorizationV11];

export const extendMap = {
  memorization: extend(memorizationV11),
};

export type MemorizedSpellV11 = Readonly<{
  spell: string;
  memorization: MemorizationV11[];
}>;
