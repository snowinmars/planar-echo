import type { RawWedPolygon } from './5.parsePolygons.types.js';

export type RawWedDoor = Readonly<{
  name: string;
  isOpen: boolean;
  firstDoorTileCellIndex: number;
  doorTileCellCount: number;
  openPolygonCount: number;
  closedPolygonCount: number;
  openPolygonsOffset: number;
  closedPolygonsOffset: number;
  doorTileCells: number[];
  openPolygons: RawWedPolygon[];
  closedPolygons: RawWedPolygon[];
}>;
