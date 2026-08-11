import type { WedPolygon } from './5.parsePolygons.types.js';

export type WedDoor = Readonly<{
  name: string;
  isOpen: boolean;
  firstDoorTileCellIndex: number;
  doorTileCellCount: number;
  openPolygonCount: number;
  closedPolygonCount: number;
  openPolygonsOffset: number;
  closedPolygonsOffset: number;
  doorTileCells: number[];
  openPolygons: WedPolygon[];
  closedPolygons: WedPolygon[];
}>;
