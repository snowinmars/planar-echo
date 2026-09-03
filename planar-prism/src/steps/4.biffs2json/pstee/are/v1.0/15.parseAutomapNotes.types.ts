import { extend } from '@/shared/extendedMap.js';

import type { Point } from '@planar/shared';

/* createGenerator().register().enum('markerColorV10',
 *    ['gray','violet','green','orange','red','blue','dark blue','light gray',]
 * ).write();
 */
const markerColorV10 = {
  0: 'gray',
  1: 'violet',
  2: 'green',
  3: 'orange',
  4: 'red',
  5: 'blue',
  6: 'dark blue',
  7: 'light gray',
} as const;
type MarkerColorV10 = typeof markerColorV10[keyof typeof markerColorV10];

export const extendMap = {
  markerColor: extend(markerColorV10),
};

type StrrefLocation = 'toh/tot' | 'tlk';
export type RawAreAutomapNoteV10 = Readonly<{
  at: Point;
  textRef: number;
  strrefLocation: StrrefLocation;
  markerColor: MarkerColorV10;
  controlId: number;
}>;
