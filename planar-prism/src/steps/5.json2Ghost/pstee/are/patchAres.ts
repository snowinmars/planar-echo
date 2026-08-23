import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildAreSkeleton } from './1.buildAreSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawAre } from '@/steps/4.biffs2json/pstee/are/index.js';
import type { GhostAreOut } from './patchAres.types.js';

export const patchAres = (
  ares: RawAre[],
): AsyncIterableIterator<GhostAreOut> => iterate<RawAre, GhostAreOut>(
  ares,
  (are, i) => {
    const skeleton = buildAreSkeleton(are);
    const ghostAre = toGhost(are);

    const percent = Math.round((i + 1) * 100 / ares.length);
    reportProgress({
      value: percent,
      step: 'are_json2ghost',
      params: {
        resourceName: are.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: are.resourceName,
      skeleton,
      are: ghostAre,
    });
  },
);
