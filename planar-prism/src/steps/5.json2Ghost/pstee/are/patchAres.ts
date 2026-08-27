import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { packAreWalk } from './0.packAreWalk.js';
import { toGhost } from './1.toGhost.js';
import { buildAreSkeleton } from './2.buildAreSkeleton.js';

import type { RawAre } from '@/steps/4.biffs2json/pstee/are/index.js';
import type { GhostAreOut } from './patchAres.types.js';
import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/parseWeds.types.js';

export const patchAres = (
  ares: RawAre[],
  weds: readonly RawWed[],
): AsyncIterableIterator<GhostAreOut> => iterate<RawAre, GhostAreOut>(
  ares,
  (are, i) => {
    const walk = packAreWalk(are, weds); // TODO [snow]: seems it is a step for wed_raw2assets, not for are_raw2assets
    const ghostAre = toGhost(are, walk);
    const skeleton = buildAreSkeleton(ghostAre);

    const percent = Math.round((i + 1) * 100 / ares.length);
    reportProgress({
      value: percent,
      step: 'are_json2ghost',
      params: {
        resourceName: are.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: are.resourceName,
      skeleton,
      are: ghostAre,
    });
  },
);
