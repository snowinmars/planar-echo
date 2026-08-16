import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import buildBcsSkeleton from './2.buildBcsSkeleton.js';

import type { RawBcs } from '@/steps/4.biffs2json/pstee/bcs/index.js';
import type { GhostBcsOut } from './patchBcs.types.js';

export const patchBcs = (
  bcss: RawBcs[],
): AsyncIterableIterator<GhostBcsOut> => iterate<RawBcs, GhostBcsOut>(
  bcss,
  (bcs, i) => {
    const skeleton = buildBcsSkeleton(bcs);

    const percent = Math.round((i + 1) * 100 / bcss.length);
    reportProgress({
      value: percent,
      step: 'bcs_json2ghost',
      params: {
        resourceName: bcs.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: bcs.resourceName,
      skeleton,
      bcs,
    });
  },
);
