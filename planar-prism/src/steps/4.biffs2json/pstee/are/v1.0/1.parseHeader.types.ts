import { extend } from '@/shared/extendedMap.js';
import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags('areaFlagsV10', {
 *   byte1:['save not allowed', 'reform party not allowed', 'dead magic zone', 'dream', 'player1 death does not end the game', 'resting not allowed', 'travel not allowed', 'you cannot rest here',],
 *    byte2:['too dangerous to rest',]
 * }).write();
 */
const areaFlagsV10 = {
  // byte1
  0x1: 'save not allowed',
  0x2: 'reform party not allowed',
  0x4: 'dead magic zone',
  0x8: 'dream',
  0x10: 'player1 death does not end the game',
  0x20: 'resting not allowed',
  0x40: 'travel not allowed',
  0x80: 'you cannot rest here',

  // byte2
  0x100: 'too dangerous to rest',
  // 0x200: unused
  // 0x400: unused
  // 0x800: unused
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
  // bit (0x80 + 0x100): "You must obtain permission to rest here." // TODO [snow]: introduce?
} as const;
type AreaFlagsV10 = typeof areaFlagsV10[keyof typeof areaFlagsV10];

/* createGenerator().register().flags('edgeFlagsV10', {
 *   byte1:['party required','party enabled',],
 * }).write();
 */
const edgeFlagsV10 = {
  // byte1
  0x1: 'party required',
  0x2: 'party enabled',
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type EdgeFlagsV10 = typeof edgeFlagsV10[keyof typeof edgeFlagsV10];

/* createGenerator().register().flags('areaTypeV10', {
 *    byte1:['hive','hive night','clerk\'s ward','lower ward','ravel\'s maze','baator','rubikon','fortress of regrets',],
 *    byte2:['curst','carceri','outdoors',],
 * }).write();
 */
const areaTypeV10 = {
  // byte1
  0x1: 'hive',
  0x2: 'hive night',
  0x4: 'clerk\'s ward',
  0x8: 'lower ward',
  0x10: 'ravel\'s maze',
  0x20: 'baator',
  0x40: 'rubikon',
  0x80: 'fortress of regrets',

  // byte2
  0x100: 'curst',
  0x200: 'carceri',
  0x400: 'outdoors',
  // 0x800: unused
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type AreaTypeV10 = typeof areaTypeV10[keyof typeof areaTypeV10] | 'indoors';

export const extendMap = {
  areaFlags: extend(areaFlagsV10),
  edgeFlags: extend(edgeFlagsV10),
  areaType: extend(areaTypeV10),
};

export type RawAreHeaderV10 = Readonly<{
  signature: 'area';
  version: 'v1.0';
  wed: string;
  lastSaved: number;
  flags: AreaFlagsV10[];
  northAreaRef: Maybe<string>;
  northAreaFlags: EdgeFlagsV10[];
  eastAreaRef: Maybe<string>;
  eastAreaFlags: EdgeFlagsV10[];
  southAreaRef: Maybe<string>;
  southAreaFlags: EdgeFlagsV10[];
  westAreaRef: Maybe<string>;
  westAreaFlags: EdgeFlagsV10[];
  areaType: AreaTypeV10[];
  rainProbability: number;
  snowProbability: number;
  fogProbability: number;
  lightningProbability: number;
  overlayTransparency: number;
  actorsOffset: number;
  actorsCount: number;
  regionsCount: number;
  regionsOffset: number;
  spawnPointsOffset: number;
  spawnPointsCount: number;
  entrancesOffset: number;
  entrancesCount: number;
  containersOffset: number;
  containersCount: number;
  itemsCount: number;
  itemsOffset: number;
  verticesOffset: number;
  verticesCount: number;
  ambientsCount: number;
  ambientsOffset: number;
  variablesOffset: number;
  variablesCount: number;
  tiledObjectFlagsCount: number;
  tiledObjectFlagsOffset: number;
  areaScript: string;
  exploredBitmaskSize: number;
  exploredBitmaskOffset: number;
  doorsCount: number;
  doorsOffset: number;
  animationsCount: number;
  animationsOffset: number;
  tiledObjectsCount: number;
  tiledObjectsOffset: number;
  songOffset: number;
  restInterruptionsOffset: number;
  automapNotesOffset: number;
  automapNotesCount: number;
  projectileTrapsOffset: number;
  projectileTrapsCount: number;
  restMovieDay: Maybe<string>;
  restMovieNight: Maybe<string>;
}>;
