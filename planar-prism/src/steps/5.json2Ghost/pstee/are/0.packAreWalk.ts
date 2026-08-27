import {
  PSTEE_SEARCH_CELL_WIDTH,
  PSTEE_SEARCH_CELL_HEIGHT,
  searchmapPropsize,
} from '@/steps/4b.raw2assets/psteeSearchmap.js';

import type { GhostAreWalk } from '@planar/shared';
import type { RawAre } from '@/steps/4.biffs2json/pstee/are/parseAres.types.js';
import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/parseWeds.types.js';

export const packAreWalk = (
  are: RawAre,
  weds: readonly RawWed[],
): GhostAreWalk => {
  const areId = are.resourceName;
  const wedName = are.header.wed;

  const wed = weds.find(x => x.resourceName === `${wedName}.wed`);
  if (!wed) throw new Error(`packWalk: skip ${areId}, no WED '${wedName.trim()}'`);

  const overlay = wed.overlays[0];
  if (!overlay) throw new Error(`packWalk: skip ${areId}, WED has no overlay0`);

  const { colsCount, rowsCount } = searchmapPropsize(overlay.width, overlay.height);
  return {
    cellWidth: PSTEE_SEARCH_CELL_WIDTH,
    cellHeight: PSTEE_SEARCH_CELL_HEIGHT,
    colsCount,
    rowsCount,
    walkBinName: `${areId}.walk`,
  };
};
