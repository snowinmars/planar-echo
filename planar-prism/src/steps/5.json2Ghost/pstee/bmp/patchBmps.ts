import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildBmpSkeleton } from './2.buildBmpSkeleton.js';

import type { RawBmp } from '@/steps/4.biffs2json/pstee/bmp/index.js';

import type { GhostBmpOut } from './patchBmps.types.js';

export const patchBmps = (
  bmps: RawBmp[],
): AsyncIterableIterator<GhostBmpOut> => iterate<RawBmp, GhostBmpOut>(
  bmps,
  (bmp, i) => {
    const ghostBmp = toGhost(bmp);
    const skeleton = buildBmpSkeleton(ghostBmp);

    const percent = Math.round((i + 1) * 100 / bmps.length);
    reportProgress({
      value: percent,
      step: 'bmp_json2ghost',
      params: {
        resourceName: bmp.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: bmp.resourceName,
      skeleton,
      bmp: ghostBmp,
    });
  },
);
