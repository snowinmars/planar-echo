import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { buildCreSkeleton } from './1.buildCreSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { RawCre } from '@/steps/4.biffs2json/pstee/cre/index.js';

import type { CreOut } from './patchCres.types.js';

export const patchCres = (
  cres: RawCre[],
  discover: DiscoverNext,
): AsyncIterableIterator<CreOut> => iterate<RawCre, CreOut>(
  cres,
  (cre, i) => {
    const ghostCre = toGhost(cre);
    const ghostCreSkeleton = buildCreSkeleton(ghostCre, discover);

    const percent = Math.round((i + 1) * 100 / cres.length);
    reportProgress({
      value: percent,
      step: 'cre_json2ghost',
      params: {
        resourceName: cre.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: cre.resourceName,
      skeleton: ghostCreSkeleton,
      cre: ghostCre,
    });
  },
);
