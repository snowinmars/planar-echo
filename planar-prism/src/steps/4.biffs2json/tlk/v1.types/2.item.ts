import { extend } from '../../../../pipes/offsetMap.js';

/* createGenerator().register().flags('flagsV10',{
 *   byte1:['no message data','text exists','sound exists','standard message','token exists'],
 * }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'no message data',
  0x2: 'text exists',
  0x4: 'sound exists',
  0x8: 'standard message',
  0x10: 'token exists',
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const offsetMap = {
  flags: extend(flagsV10),
};

export type Item = Readonly<{
  index: number;
  flags: FlagsV10[];
  soundResRef: string;
  volume: number;
  pitch: number;
  offset: number;
  length: number;
  text: string;
}>;
