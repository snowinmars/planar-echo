import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('itemFlagsV10', {
 *   byte1:['identified','unstealable','stolen','undroppable',],
 * }).write();
 */
const itemFlagsV10 = {
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
type ItemFlagsV10 = typeof itemFlagsV10[keyof typeof itemFlagsV10];

export const extendMap = {
  itemFlags: extend(itemFlagsV10),
};

export type RawAreItemV10 = Readonly<{
  resref: string;
  expiryTime: number;
  quantity1: number;
  quantity2: number;
  quantity3: number;
  flags: ItemFlagsV10[];
}>;
