import { extend } from '../../../../pipes/offsetMap.js';
import type { Maybe } from '../../../../shared/types.js';

/* createGenerator().register().flags('memorisedV10', {
 *   byte1: ['Memorised','Disabled'],
 * }).write();
 */
const memorisedV10 = {
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
type MemorisedV10 = typeof memorisedV10[keyof typeof memorisedV10];

export const offsetMap = {
  memorised: extend(memorisedV10),
};

export type MemorizedSpellV10 = Readonly<{
  resourceName: string;
  memorised: MemorisedV10[];
}>;
