import type { RawWedHeader } from './v1.3/1.parseHeader.types.js';
import type { RawWedOverlay } from './v1.3/2.parseOverlay.types.js';
import type { RawWedSecondaryHeader } from './v1.3/3.parseSecondaryHeader.types.js';
import type { RawWedVertex } from './v1.3/4.parseVertices.types.js';
import type { RawWedPolygon } from './v1.3/5.parsePolygons.types.js';
import type { RawWedDoor } from './v1.3/6.parseDoors.types.js';
import type { RawWedWallGroup } from './v1.3/7.parseWallGroups.types.js';

export type RawWed = Readonly<{
  resourceName: string;
  header: RawWedHeader;
  overlays: RawWedOverlay[];
  secondaryHeader: RawWedSecondaryHeader;
  vertices: RawWedVertex[];
  wallPolygons: RawWedPolygon[];
  doors: RawWedDoor[];
  wallGroups: RawWedWallGroup[];
  polygonIndicesLookupTable: number[];
}>;
