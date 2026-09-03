import { extend } from '@/shared/extendedMap.js';

import type { Maybe, Point, Rectangle } from '@planar/shared';

import type { RawAreVertexV10 } from './8.parseVertices.types.js';

/* createGenerator().register().flags('doorFlagsV10', {
 *   byte1:['door open','door locked','reset trap','trap detectable','broken','ca not close','linked','door hidden',],
 *   byte2:['door found (if hidden)','do not block line f sight','remove key (bg2 only)','ignore obstacles when closing',],
 * }).write();
 */
const doorFlagsV10 = {
  // byte1
  0x1: 'door open',
  0x2: 'door locked',
  0x4: 'reset trap',
  0x8: 'trap detectable',
  0x10: 'broken',
  0x20: 'ca not close',
  0x40: 'linked',
  0x80: 'door hidden',

  // byte2
  0x100: 'door found (if hidden)',
  0x200: 'do not block line f sight',
  0x400: 'remove key (bg2 only)',
  0x800: 'ignore obstacles when closing',
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type DoorFlagsV10 = typeof doorFlagsV10[keyof typeof doorFlagsV10];

export const extendMap = {
  doorFlags: extend(doorFlagsV10),
};

type DoorGeometry = Readonly<{
  boundingBox: Rectangle;
  vertices: RawAreVertexV10[];
  impeded: RawAreVertexV10[];
}>;
export type RawAreDoorV10 = Readonly<{
  name: string;
  doorId: string;
  flags: DoorFlagsV10[];
  openedGeometry: DoorGeometry;
  closedGeometry: DoorGeometry;
  hitPoints: number;
  armorClass: number;
  openSound: Maybe<string>;
  closeSound: Maybe<string>;
  cursorIndex: number;
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  launch: Point;
  key: Maybe<string>;
  script: Maybe<string>;
  detectionDifficulty: number;
  lockDifficulty: number;
  openLocation: Point;
  closeLocation: Point;
  lockpickStringRef: Maybe<number>;
  travelTriggerName: Maybe<string>;
  speakerNameRef: Maybe<number>;
  dialog: Maybe<string>;
}>;
