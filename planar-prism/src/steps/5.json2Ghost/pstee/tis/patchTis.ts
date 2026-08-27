import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { toGhost } from './1.toGhost.js';
import { buildTisSkeleton } from './2.buildTisSkeleton.js';

import type { RawTis } from '@/steps/4.biffs2json/pstee/tis/parseTiss.types.js';
import type { GhostTisOut } from './patchTis.types.js';

export const patchTis = (
  tiss: RawTis[],
): AsyncIterableIterator<GhostTisOut> => iterate<RawTis, GhostTisOut>(
  tiss,
  (tis, i) => {
    const ghostTis = toGhost(tis);
    const skeleton = buildTisSkeleton(ghostTis);

    const percent = Math.round((i + 1) * 100 / tiss.length);
    reportProgress({
      value: percent,
      step: 'tis_json2ghost',
      params: {
        resourceName: tis.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: tis.resourceName,
      skeleton,
      tis: ghostTis,
    });
  },
);
