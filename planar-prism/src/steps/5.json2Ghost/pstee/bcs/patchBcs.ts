import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildBcsSkeleton } from './1.buildBcsSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawBcs } from '@/steps/4.biffs2json/pstee/bcs/index.js';
import type { GhostBcsOut } from './patchBcs.types.js';

export const patchBcs = (
  bcss: RawBcs[],
): AsyncIterableIterator<GhostBcsOut> => iterate<RawBcs, GhostBcsOut>(
  bcss,
  (bcs, i) => {
    const skeleton = buildBcsSkeleton(bcs);
    const ghostBcs = toGhost(bcs);

    const percent = Math.round((i + 1) * 100 / bcss.length);
    reportProgress({
      value: percent,
      step: 'bcs_json2ghost',
      params: {
        resourceName: bcs.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: bcs.resourceName,
      skeleton,
      bcs: ghostBcs,
    });
  },
);
