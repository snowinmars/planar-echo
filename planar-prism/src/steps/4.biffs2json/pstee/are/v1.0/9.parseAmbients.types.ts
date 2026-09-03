import { extend } from '@/shared/extendedMap.js';

import type { Point } from '@planar/shared';

/* createGenerator().register().flags('presentedAtFlagsV10', {
 *    byte1: ['00:30..01:29','01:30..02:29','02:30..03:29','03:30..04:29','04:30..05:29','05:30..06:29','06:30..07:29','07:30..08:29',],
 *    byte2: ['08:30..09:29','09:30..10:29','10:30..11:29','11:30..12:29','12:30..13:29','13:30..14:29','14:30..15:29','15:30..16:29',],
 *    byte3: ['16:30..17:29','17:30..18:29','18:30..19:29','19:30..20:29','20:30..21:29','21:30..22:29','22:30..23:29','23:30..00:29',],
 * }).write();
 */
const presentedAtFlagsV10 = {
  // byte1
  0x1: '00:30..01:29',
  0x2: '01:30..02:29',
  0x4: '02:30..03:29',
  0x8: '03:30..04:29',
  0x10: '04:30..05:29', // ^ night
  0x20: '05:30..06:29', // dawn
  0x40: '06:30..07:29', // v day
  0x80: '07:30..08:29',

  // byte2
  0x100: '08:30..09:29',
  0x200: '09:30..10:29',
  0x400: '10:30..11:29',
  0x800: '11:30..12:29',
  0x1000: '12:30..13:29',
  0x2000: '13:30..14:29',
  0x4000: '14:30..15:29',
  0x8000: '15:30..16:29',

  // byte3
  0x10000: '16:30..17:29',
  0x20000: '17:30..18:29',
  0x40000: '18:30..19:29',
  0x80000: '19:30..20:29', // ^ day
  0x100000: '20:30..21:29', // dusk
  0x200000: '21:30..22:29', // v night
  0x400000: '22:30..23:29',
  0x800000: '23:30..00:29',
} as const;
type PresentedAtFlagsV10 = typeof presentedAtFlagsV10[keyof typeof presentedAtFlagsV10];

/* createGenerator().register().flags('ambientFlagsV10', {
 *   byte1:['ambient enabled','disable environmental effects','global (ignores radius)','random ambient selection','affected by lowmemsounds1',],
 * }).write();
 */
const ambientFlagsV10 = {
  // byte1
  0x1: 'ambient enabled',
  0x2: 'disable environmental effects',
  0x4: 'global (ignores radius)',
  0x8: 'random ambient selection',
  0x10: 'affected by lowmemsounds1',
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type AmbientFlagsV10 = typeof ambientFlagsV10[keyof typeof ambientFlagsV10];

export const extendMap = {
  ambientFlags: extend(ambientFlagsV10),
  presentedAtFlags: extend(presentedAtFlagsV10),
};

export type RawAreAmbientV10 = Readonly<{
  name: string;
  at: Point;
  radius: number;
  height: number;
  pitchVariation: number;
  volumeVariation: number;
  volume: number;
  sounds: string[];
  soundsCount: number;
  intervalBase: number;
  intervalVariation: number;
  presentedAt: PresentedAtFlagsV10[];
  flags: AmbientFlagsV10[];
}>;
