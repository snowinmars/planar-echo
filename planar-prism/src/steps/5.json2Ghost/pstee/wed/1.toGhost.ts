import type { GhostWed } from '@planar/shared';

import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/parseWeds.types.js';

export const toGhost = (raw: RawWed): GhostWed => {
  const overlays = raw.overlays
    .filter(x => x.width > 0 && x.height > 0);

  return ({
    ...raw,
    header: {
      signature: raw.header.signature,
      version: raw.header.version,
      overlaysCount: overlays.length,
      doorsCount: raw.header.doorsCount,
      wallPolygonCount: raw.secondaryHeader.wallPolygonCount,
    },
    overlays,
  });
};
