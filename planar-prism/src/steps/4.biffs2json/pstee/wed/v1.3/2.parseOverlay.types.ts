import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().flags('drawOverlayV10',{
 *   byte1:['unused','draw overlay 1','draw overlay 2','draw overlay 3','draw overlay 4','draw overlay 5','draw overlay 6','draw overlay 7',],
 *  }).write();
 */
const drawOverlayV10 = {
  // byte1
  0x1: 'unused',
  0x2: 'draw overlay 1',
  0x4: 'draw overlay 2',
  0x8: 'draw overlay 3',
  0x10: 'draw overlay 4',
  0x20: 'draw overlay 5',
  0x40: 'draw overlay 6',
  0x80: 'draw overlay 7',
} as const;
type DrawOverlayV10 = typeof drawOverlayV10[keyof typeof drawOverlayV10];

export const extendMap = {
  drawOverlay: extend(drawOverlayV10),
};

export type RawWedTilemap = Readonly<{
  tileIndexLookupStart: number;
  tileIndexLookupCount: number;
  secondaryTileIndex: number;
  drawOverlays: DrawOverlayV10[];
  animationSpeed: number;
  tileIndices: number[]; // seems redundand, because without animation always has 1 number, that is equal to tileIndexLookupStart // TODO [snow]: deal with it
}>;

export type RawWedOverlay = Readonly<{
  width: number;
  height: number;
  tileset: string;
  uniqueTileCount: number;
  movementType: number;
  tilemapOffset: number;
  tileIndexLookupOffset: number;
  tilemaps: RawWedTilemap[];
}>;
