export type GhostWedHeader = Readonly<{
  signature: 'wed';
  version: 'v1.3';
  overlaysCount: number;
  doorsCount: number;
  overlaysOffset: number;
  secondaryHeaderOffset: number;
  doorsOffset: number;
  doorsTileCellsOffset: number;
}>;

export type GhostWedTilemap = Readonly<{
  tileIndexLookupStart: number;
  tileIndexLookupCount: number;
  secondaryTileIndex: number;
  drawOverlays: string[];
  animationSpeed: number;
  tileIndices: number[];
}>;

export type GhostWedOverlay = Readonly<{
  width: number;
  height: number;
  tileset: string;
  uniqueTileCount: number;
  movementType: number;
  tilemapOffset: number;
  tileIndexLookupOffset: number;
  tilemaps: GhostWedTilemap[];
}>;

export type GhostWedSecondaryHeader = Readonly<{
  wallPolygonCount: number;
  polygonsOffset: number;
  verticesOffset: number;
  wallGroupsOffset: number;
  polygonIndicesLookupTableOffset: number;
}>;

export type GhostWedVertex = Readonly<{
  x: number;
  y: number;
}>;

export type GhostWedPolygon = Readonly<{
  vertexStartingIndex: number;
  vertexCount: number;
  flags: string[];
  height: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}>;

export type GhostWedDoor = Readonly<{
  name: string;
  isOpen: boolean;
  firstDoorTileCellIndex: number;
  doorTileCellCount: number;
  openPolygonCount: number;
  closedPolygonCount: number;
  openPolygonsOffset: number;
  closedPolygonsOffset: number;
  doorTileCells: number[];
  openPolygons: GhostWedPolygon[];
  closedPolygons: GhostWedPolygon[];
}>;

export type GhostWedWallGroup = Readonly<{
  lookupStart: number;
  lookupCount: number;
  polygonIndices: number[];
}>;

export type GhostWed = Readonly<{
  resourceName: string;
  header: GhostWedHeader;
  overlays: GhostWedOverlay[];
  secondaryHeader: GhostWedSecondaryHeader;
  vertices: GhostWedVertex[];
  wallPolygons: GhostWedPolygon[];
  doors: GhostWedDoor[];
  wallGroups: GhostWedWallGroup[];
  polygonIndicesLookupTable: number[];
}>;
