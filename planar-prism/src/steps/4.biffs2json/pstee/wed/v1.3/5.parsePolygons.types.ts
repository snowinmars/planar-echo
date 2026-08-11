import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('flagsV10',{
 *   byte1:['shade wall','hovering','cover animations','cover animations','unknown','unknown','unknown','door',],
 *  }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'shade wall',
  0x2: 'hovering',
  0x4: 'cover animations',
  0x8: 'cover animations',
  0x10: 'unknown',
  0x20: 'unknown',
  0x40: 'unknown',
  0x80: 'door',
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const extendMap = {
  flags: extend(flagsV10),
};

export type WedPolygon = Readonly<{
  vertexStartingIndex: number;
  vertexCount: number;
  flags: FlagsV10[];
  height: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}>;
