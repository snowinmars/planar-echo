import { readFile } from 'fs/promises';
import { join } from 'path';
import logger from '@/shared/logger.js';
import {
  searchmapPropsize,
} from './psteeSearchmap.js';
import { just } from '@planar/shared';
import { reportProgress } from '@/shared/report.js';
import { withoutExtension } from '@planar/shared';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { AllPsteeJsons } from '@/steps/4.biffs2json/types.js';
import type { RawAre } from '@/steps/4.biffs2json/pstee/are/parseAres.types.js';
import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/parseWeds.types.js';

/**
 * GemRB hardcoded PathMapFlags PASSABLE bit when terrain.2da is missing.
 * Ask gemrb team of what does they mean
 * https://github.com/gemrb/gemrb/blob/master/gemrb/unhardcoded/pst/terrain.2da
 */
const UNPASSABLE_WALK = 0; // TODO [snow]: these const uses in kernel, join
const PASSABLE_WALK = 1;
const GEMRB_DEFAULT_PASSABLE: (0 | 1)[] = [
  UNPASSABLE_WALK, PASSABLE_WALK, PASSABLE_WALK, PASSABLE_WALK,
  PASSABLE_WALK, PASSABLE_WALK, PASSABLE_WALK, PASSABLE_WALK,
  UNPASSABLE_WALK, PASSABLE_WALK, UNPASSABLE_WALK, UNPASSABLE_WALK,
  UNPASSABLE_WALK, UNPASSABLE_WALK, PASSABLE_WALK, PASSABLE_WALK,
];

type PackSearchmapProps = Readonly<{
  colsCount: number;
  rowsCount: number;
  bmpWidth: number;
  bmpHeight: number;
  indices: Uint8Array;
  passableByIndex?: (0 | 1)[];
}>;
const packSearchmapToPropsize = ({
  colsCount,
  rowsCount,
  bmpWidth,
  bmpHeight,
  indices,
  passableByIndex = GEMRB_DEFAULT_PASSABLE,
}: PackSearchmapProps): Uint8Array => {
  if (colsCount <= 0 || rowsCount <= 0) throw new Error('Unpexpected empty colsCount or rowsCount');

  const grid = new Uint8Array(colsCount * rowsCount);

  for (let y = 0; y < rowsCount; y++) {
    for (let x = 0; x < colsCount; x++) {
      const i = y * colsCount + x;

      const outOfBpmRange = x >= bmpWidth || y >= bmpHeight;
      if (outOfBpmRange) throw new Error(`Expect coordinates ('${x}', '${y}') to be in bpm size range ('${bmpWidth}', '${bmpHeight}')`);

      const paletteIndex = just(indices[y * bmpWidth + x]);
      const passable = just(passableByIndex[paletteIndex & 0x0f]);

      grid[i] = passable;
    }
  }

  return grid;
};

// sr = searchmap = grid of walkable/unaccessable cells
// lm = lightmap = color or lightning
// ht = heightmap = ramp or kinda
const loadSrIndices = async (
  paths: Paths,
  bmps: AllPsteeJsons['bmps'],
  wedId: string,
): Promise<Readonly<{ width: number; height: number; indices: Uint8Array }>> => {
  const bpmId = `${wedId}sr`;
  const bmp = bmps.find(item => withoutExtension(item.resourceName) === bpmId)!;

  const indicesPath = join(paths.ghostDir.assets.bmp, `${bmp.resourceName}.indices`);
  const buf = await readFile(indicesPath);
  return {
    width: bmp.header.width,
    height: bmp.header.height,
    indices: new Uint8Array(buf),
  };
};

const getOneAreWalkableArea = async (
  are: RawAre,
  weds: RawWed[],
  bmps: AllPsteeJsons['bmps'],
  paths: Paths,
): Promise<Uint8Array> => {
  const wed = weds.find(item => withoutExtension(item.resourceName) === are.header.wed);
  if (!wed) throw new Error(`No wed '${are.header.wed}' for '${are.resourceName}'`);

  const overlay = wed.overlays[0];
  if (!overlay) throw new Error(`Wed in '${are.resourceName}' has first overlay empty`);

  const { colsCount, rowsCount } = searchmapPropsize(overlay.width, overlay.height);
  const sr = await loadSrIndices(paths, bmps, are.header.wed);

  const grid = packSearchmapToPropsize({
    colsCount,
    rowsCount,
    bmpWidth: sr.width,
    bmpHeight: sr.height,
    indices: sr.indices,
    passableByIndex: GEMRB_DEFAULT_PASSABLE,
  });

  return grid;
};

export const writeAreWalks = async (allJsons: AllPsteeJsons, paths: Paths): Promise<void> => {
  for (let i = 0; i < allJsons.ares.length; i++) {
    const are = allJsons.ares[i]!;

    const buffer = await getOneAreWalkableArea(are, allJsons.weds, allJsons.bmps, paths);
    await paths.ghostDir.saveAssets.are.walk(are.resourceName, Buffer.from(Uint8Array.from(buffer)));

    const percent = Math.round(i * 100 / allJsons.ares.length);
    reportProgress({
      value: percent,
      step: 'are_raw2assets',
      params: {
        resourceName: are.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });
  }

  logger.info(`are walk: wrote ${allJsons.ares.length} grids to ${paths.ghostDir.assets.are}`);
};
