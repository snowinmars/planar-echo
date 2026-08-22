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

/* createGenerator().register().flags('animationFlagsV10', {
 *    byte1:['animation enabled','blended','non-self illumination','partial animation (stops at bamframenumber)','synchronized draw','use random start frame','wall does not hide animation','disable on slow machines',],
 *    byte2:['alt. blending mode','play all frames','use palette bitmap','mirrored','show in combat',null,null,'use pvrz resref',],
 *    byte3:['cover animations',],
 * }).write();
 */
const animationFlagsV10 = {
  // byte1
  0x1: 'animation enabled',
  0x2: 'blended',
  0x4: 'non-self illumination',
  0x8: 'partial animation (stops at bamframenumber)',
  0x10: 'synchronized draw',
  0x20: 'use random start frame',
  0x40: 'wall does not hide animation',
  0x80: 'disable on slow machines',

  // byte2
  0x100: 'alt. blending mode',
  0x200: 'play all frames',
  0x400: 'use palette bitmap',
  0x800: 'mirrored',
  0x1000: 'show in combat',
  // 0x2000: unused
  // 0x4000: unused
  0x8000: 'use pvrz resref',

  // byte3
  0x10000: 'cover animations',
  // 0x20000: unused
  // 0x40000: unused
  // 0x80000: unused
  // 0x100000: unused
  // 0x200000: unused
  // 0x400000: unused
  // 0x800000: unused
} as const;
type AnimationFlagsV10 = typeof animationFlagsV10[keyof typeof animationFlagsV10];

export const extendMap = {
  animationFlags: extend(animationFlagsV10),
  presentedAtFlags: extend(presentedAtFlagsV10),
};

export type RawAreAnimationV10 = Readonly<{
  name: string;
  at: Point;
  presentedAt: PresentedAtFlagsV10[];
  animationResref: string;
  bamSequenceNumber: number;
  bamFrameNumber: number;
  flags: AnimationFlagsV10[];
  height: number;
  transparency: number;
  startFrame: number;
  loopProbability: number;
  skipCycles: number;
  palette: string;
  animationWidth: number;
  animationHeight: number;
}>;
