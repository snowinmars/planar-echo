import { extend } from '@/shared/extendedMap.js';

import type { Maybe, Point, Rectangle } from '@planar/shared';

import type { RawAreItemV10 } from './7.parseItems.types.js';
import type { RawAreVertexV10 } from './8.parseVertices.types.js';

/* createGenerator().register().enum('containerTypeV10',
 *   ['n/a','bag','chest','drawer','pile','table','shelf','altar','nonvisible','spellbook','body','barrel','crate',]
 * ).write();
 */
const containerTypeV10 = {
  0: 'n/a',
  1: 'bag',
  2: 'chest',
  3: 'drawer',
  4: 'pile',
  5: 'table',
  6: 'shelf',
  7: 'altar',
  8: 'nonvisible',
  9: 'spellbook',
  10: 'body',
  11: 'barrel',
  12: 'crate',
} as const;
type ContainerTypeV10 = typeof containerTypeV10[keyof typeof containerTypeV10];

/* createGenerator().register().flags('containerFlagsV10', {
 *   byte1:['locked','disable if no owner','magically locked','trap resets','remove only','disabled',],
 * }).write();
 */
const containerFlagsV10 = {
  // byte1
  0x1: 'locked',
  0x2: 'disable if no owner',
  0x4: 'magically locked',
  0x8: 'trap resets',
  0x10: 'remove only',
  0x20: 'disabled',
  // 0x40: unused
  // 0x80: unused
} as const;
type ContainerFlagsV10 = typeof containerFlagsV10[keyof typeof containerFlagsV10];

export const extendMap = {
  containerType: extend(containerTypeV10),
  containerFlags: extend(containerFlagsV10),
};

export type RawAreContainerV10 = Readonly<{
  name: string;
  at: Point;
  type: ContainerTypeV10;
  lockDifficulty: number;
  flags: ContainerFlagsV10[];
  trapDetectionDifficulty: number;
  trapRemovalDifficulty: number;
  trapped: boolean;
  trapDetected: boolean;
  launch: Point;
  boundingBox: Rectangle;
  items: RawAreItemV10[];
  trapScript: Maybe<string>;
  vertices: RawAreVertexV10[];
  triggerRange: number;
  owner: Maybe<string>;
  key: Maybe<string>;
  breakDifficulty: number;
  lockpickStringRef: number;
}>;
