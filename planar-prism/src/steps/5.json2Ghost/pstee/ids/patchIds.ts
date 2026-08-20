import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildIdsSkeleton } from './1.buildIdsSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawIds } from '@/steps/4.biffs2json/pstee/ids/index.js';
import type { GhostIdsOut } from './patchIds.types.js';

export const patchIds = (
  idss: RawIds[],
): AsyncIterableIterator<GhostIdsOut> => iterate<RawIds, GhostIdsOut>(
  idss,
  (ids, i) => {
    const skeleton = buildIdsSkeleton(ids);
    const ghostIds = toGhost(ids);

    const percent = Math.round((i + 1) * 100 / idss.length);
    reportProgress({
      value: percent,
      step: 'ids_json2ghost',
      params: {
        resourceName: ids.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: ids.resourceName,
      skeleton,
      ids: ghostIds,
    });
  },
);
