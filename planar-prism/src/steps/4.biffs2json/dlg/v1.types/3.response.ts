import { extend } from '../../../../pipes/offsetMap.js';
import type { Maybe } from '../../../../shared/maybe.js';
import type { Item } from '../../tlk/v1.types/2.item.js';
import type { DlgFunction } from './4.function.js';

/* createGenerator().register().flags('flagsV10',{
 *   byte1:['has associated text','has trigger','has action','terminates dialog','has journal entry','interrupt','add unsolved quest journal entry','add journal note'],
 *   byte2:['add solved quest journal entry','immediate execution of script actions','clear actions']
 * }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'has associated text',
  0x2: 'has trigger',
  0x4: 'has action',
  0x8: 'terminates dialog',
  0x10: 'has journal entry',
  0x20: 'interrupt',
  0x40: 'add unsolved quest journal entry',
  0x80: 'add journal note',

  // byte2
  0x100: 'add solved quest journal entry',
  0x200: 'immediate execution of script actions',
  0x400: 'clear actions',
  // 0x800: unused
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const offsetMap = {
  flags: extend(flagsV10),
};

export type RawResponse = Readonly<{
  index: number;
  flags: FlagsV10[];
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
  triggerIndex: Maybe<number>;
  actionIndex: Maybe<number>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textTlk: Maybe<Item>;
  journalTlk: Maybe<Item>;
}>;

export type DlgResponse = Readonly<{
  index: number;
  flags: FlagsV10[];
  textRef: Maybe<number>;
  journalRef: Maybe<number>;
  trigger: Maybe<DlgFunction>;
  action: Maybe<DlgFunction>;
  nextDialog: Maybe<string>;
  nextDialogState: Maybe<number>;
  textTlk: Maybe<Item>;
  journalTlk: Maybe<Item>;
}>;
