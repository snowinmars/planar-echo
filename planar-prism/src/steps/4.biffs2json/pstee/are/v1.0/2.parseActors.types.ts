import { extend } from '@/shared/extendedMap.js';
import type { Direction, Maybe, Point } from '@planar/shared';

/* createGenerator().register().flags('actorFlagsV10', {
 *   byte1:['cre not attached', 'has seen party', 'invulnerable', 'override script name',],
 * }).write();
 */
const actorFlagsV10 = {
  // byte1
  0x1: 'cre not attached',
  0x2: 'has seen party',
  0x4: 'invulnerable',
  0x8: 'override script name',
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type ActorFlagsV10 = typeof actorFlagsV10[keyof typeof actorFlagsV10];

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

export const extendMap = {
  actorFlags: extend(actorFlagsV10),
  presentedAtFlags: extend(presentedAtFlagsV10),
};

export type RawAreActorV10 = Readonly<{
  name: string;
  at: Point;
  destX: number;
  destY: number;
  flags: ActorFlagsV10[];
  isSpawnedAsRandomMonster: boolean;
  creResrefLetter: Maybe<string>;
  animation: string;
  direction: Direction;
  expiryTime: number;
  wanderDistance: number;
  followDistance: number;
  presentedAt: PresentedAtFlagsV10[];
  numTimesTalkedTo: number;
  dialog: Maybe<string>;
  scriptOverride: Maybe<string>;
  scriptGeneral: string;
  scriptClass: Maybe<string>;
  scriptRace: Maybe<string>;
  scriptDefault: Maybe<string>;
  scriptSpecifics: Maybe<string>;
  cre: string;
  creOffset: Maybe<number>;
  creSize: Maybe<number>;
}>;
