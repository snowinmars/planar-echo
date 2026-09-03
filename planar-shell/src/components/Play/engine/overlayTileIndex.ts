import { just } from '@planar/shared';

import type { GhostWedOverlay } from '@planar/shared';

type OverlayTilemap = GhostWedOverlay['tilemaps'][number];

/**
 * open = primary
 * closed = secondary
 * beware that in pst boolean 'door open' flag is reversed in compare with bg
 */
export const overlayTileIndex = (
  tilemap: OverlayTilemap,
  doorOpen: boolean | undefined,
): number => {
  const primary = just(tilemap.tileIndices[0]);

  const notDoor = doorOpen === undefined;
  if (notDoor) return primary;

  if (doorOpen) return primary;

  const secondary = tilemap.secondaryTileIndex;
  if (secondary < 0 || secondary >= 0xffff) return primary; // TODO [snow]: ever occurs?

  return secondary;
};
