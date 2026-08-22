import { extend } from '@/shared/extendedMap.js';

import type { RawAreVertexV10 } from './8.parseVertices.types.js';

/* createGenerator().register().flags('tiledObjectFlagsV10', {
 *   byte1:['currently in secondary state','can be seen through',],
 * }).write();
 */
const tiledObjectFlagsV10 = {
  // byte1
  0x1: 'currently in secondary state',
  0x2: 'can be seen through',
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type TiledObjectFlagsV10 = typeof tiledObjectFlagsV10[keyof typeof tiledObjectFlagsV10];

export const extendMap = {
  tiledObjectFlags: extend(tiledObjectFlagsV10),
};

export type RawAreTiledObjectV10 = Readonly<{
  name: string;
  tileId: string;
  flags: TiledObjectFlagsV10[];
  openImpeded: RawAreVertexV10[];
  closedImpeded: RawAreVertexV10[];
}>;
