import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildPvrSkeleton } from './2.buildPvrSkeleton.js';

import type { RawPvr } from '@/steps/4.biffs2json/pstee/pvrz/index.js';

import type { GhostPvrOut } from './patchPvr.types.js';

export const patchPvr = (
  pvrs: RawPvr[],
): AsyncIterableIterator<GhostPvrOut> => iterate<RawPvr, GhostPvrOut>(
  pvrs,
  (pvr, i) => {
    const ghostPvr = toGhost(pvr);
    const skeleton = buildPvrSkeleton(ghostPvr);

    const percent = Math.round((i + 1) * 100 / pvrs.length);
    reportProgress({
      value: percent,
      step: 'pvrz_json2ghost',
      params: {
        resourceName: pvr.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: pvr.resourceName,
      skeleton,
      pvr,
    });
  },
);
