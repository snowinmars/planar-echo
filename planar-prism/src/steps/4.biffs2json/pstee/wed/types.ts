import type { WedHeader } from './v1.3/1.parseHeader.types.js';
import type { WedOverlay } from './v1.3/2.parseOverlay.types.js';
import type { WedSecondaryHeader } from './v1.3/3.parseSecondaryHeader.types.js';
import type { WedVertex } from './v1.3/4.parseVertices.types.js';
import type { WedPolygon } from './v1.3/5.parsePolygons.types.js';
import type { WedDoor } from './v1.3/6.parseDoors.types.js';
import type { WedWallGroup } from './v1.3/7.parseWallGroups.types.js';

export type Wed = Readonly<{
  resourceName: string;
  header: WedHeader;
  overlays: WedOverlay[];
  secondaryHeader: WedSecondaryHeader;
  vertices: WedVertex[];
  wallPolygons: WedPolygon[];
  doors: WedDoor[];
  wallGroups: WedWallGroup[];
  polygonIndicesLookupTable: number[];
}>;
