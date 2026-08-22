import { extend } from '@/shared/extendedMap.js';

import type { RawAreVertexV10 } from './8.parseVertices.types.js';
import type { Rectangle, Point, Maybe } from '@planar/shared';

/* createGenerator().register().enum('regionTypeV10',
 *    ['proximity trigger','info point','travel region', ],
 * ).write();
 */
const regionTypeV10 = {
  0: 'proximity trigger',
  1: 'info point',
  2: 'travel region',
} as const;
type RegionTypeV10 = typeof regionTypeV10[keyof typeof regionTypeV10];

/* createGenerator().register().flags('regionFlagsV10', {
 *    byte1: ['key required','reset trap (for proximity triggers)','party required flag (for travel triggers)','detectable','npc activates','active in tutorial area only','anyone activates','no string',],
 *    byte2: ['deactivated (for proximity triggers)','party only','alternative point','door closed',],
 * }).write();
 */
const regionFlagsV10 = {
  // byte1
  0x1: 'key required',
  0x2: 'reset trap (for proximity triggers)',
  0x4: 'party required flag (for travel triggers)',
  0x8: 'detectable',
  0x10: 'npc activates',
  0x20: 'active in tutorial area only',
  0x40: 'anyone activates',
  0x80: 'no string',

  // byte2
  0x100: 'deactivated (for proximity triggers)',
  0x200: 'party only',
  0x400: 'alternative point',
  0x800: 'door closed',
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type RegionFlagsV10 = typeof regionFlagsV10[keyof typeof regionFlagsV10];

export const extendMap = {
  regionType: extend(regionTypeV10),
  regionFlags: extend(regionFlagsV10),
};

export type RawAreRegionV10 = Readonly<{
  name: string;
  type: RegionTypeV10;
  boundingBox: Rectangle;
  vertices: RawAreVertexV10[];
  triggerValue: number;
  cursorIndex: number;
  destinationArea: string;
  entranceName: string;
  flags: RegionFlagsV10[];
  infoPointTextRef: Maybe<number>;
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  trapLaunchAt: Point;
  key: Maybe<string>;
  script: Maybe<string>;
  activation: Point;
  sound: string;
  speaker: Point;
  speakerNameRef: number;
  dialog: string;
}>;
