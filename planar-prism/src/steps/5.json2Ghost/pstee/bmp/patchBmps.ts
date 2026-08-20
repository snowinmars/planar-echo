import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildBmpSkeleton } from './1.buildBmpSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { GhostBmpOut } from './patchBmps.types.js';
import type { RawBmp } from '@/steps/4.biffs2json/pstee/bmp/index.js';

export const patchBmps = (
  bmps: RawBmp[],
): AsyncIterableIterator<GhostBmpOut> => iterate<RawBmp, GhostBmpOut>(
  bmps,
  (bmp, i) => {
    const skeleton = buildBmpSkeleton(bmp);
    const ghostBmp = toGhost(bmp);

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
