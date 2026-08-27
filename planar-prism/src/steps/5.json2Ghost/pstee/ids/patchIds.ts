import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { toGhost } from './1.toGhost.js';
import { buildIdsSkeleton } from './2.buildIdsSkeleton.js';

import type { RawIds } from '@/steps/4.biffs2json/pstee/ids/index.js';
import type { GhostIdsOut } from './patchIds.types.js';

export const patchIds = (
  idss: RawIds[],
): AsyncIterableIterator<GhostIdsOut> => iterate<RawIds, GhostIdsOut>(
  idss,
  (ids, i) => {
    const ghostIds = toGhost(ids);
    const skeleton = buildIdsSkeleton(ghostIds);

    const percent = Math.round((i + 1) * 100 / idss.length);
    reportProgress({
      value: percent,
      step: 'ids_json2ghost',
      params: {
        resourceName: ids.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: ids.resourceName,
      skeleton,
      ids: ghostIds,
    });
  },
);
