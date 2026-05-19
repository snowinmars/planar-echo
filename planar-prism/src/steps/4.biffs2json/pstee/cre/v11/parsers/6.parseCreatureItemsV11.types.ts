import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('alignmentV11', {
 *   byte1: ['identified','unstealable','stolen','undroppable'],
 * }).write();
 */
const flagsV11 = {
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
type FlagsV11 = typeof flagsV11[keyof typeof flagsV11];

export const extendMap = {
  flags: extend(flagsV11),
};

export type ItemV11 = Readonly<{
  item: string;
  duration: number;
  quantityCharges1: number;
  quantityCharges2: number;
  quantityCharges3: number;
  flags: FlagsV11[];
}>;
