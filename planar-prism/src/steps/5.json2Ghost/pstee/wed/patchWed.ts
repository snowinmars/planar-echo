import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildWedSkeleton } from './2.buildWedSkeleton.js';

import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/index.js';

import type { GhostWedOut } from './patchWed.types.js';

export const patchWed = (
  weds: RawWed[],
): AsyncIterableIterator<GhostWedOut> => iterate<RawWed, GhostWedOut>(
  weds,
  (wed, i) => {
    const ghostWed = toGhost(wed);
    const skeleton = buildWedSkeleton(ghostWed);

    const percent = Math.round((i + 1) * 100 / weds.length);
    reportProgress({
      value: percent,
      step: 'wed_json2ghost',
      params: {
        resourceName: wed.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: wed.resourceName,
      skeleton,
      wed: ghostWed,
    });
  },
);
