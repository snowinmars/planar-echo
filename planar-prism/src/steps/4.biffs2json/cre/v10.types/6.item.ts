import { extend } from '@/pipes/offsetMap.js';

/* createGenerator().register().flags('alignmentV10', {
 *   byte1: ['identified','unstealable','stolen','undroppable'],
 * }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'identified',
  0x2: 'unstealable',
  0x4: 'stolen',
  0x8: 'undroppable',
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const offsetMap = {
  flags: extend(flagsV10),
};

export type ItemV10 = Readonly<{
  resourceName: string;
  duration: number;
  quantityCharges1: number;
  quantityCharges2: number;
  quantityCharges3: number;
  flags: FlagsV10[];
}>;
