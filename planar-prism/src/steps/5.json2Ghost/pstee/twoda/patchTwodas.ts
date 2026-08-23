import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildTwodaSkeleton } from './1.buildTwodaSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { Raw2da } from '@/steps/4.biffs2json/pstee/2da/index.js';
import type { GhostTwodaOut } from './patchTwodas.types.js';

export const patchTwodas = (
  twodas: Raw2da[],
): AsyncIterableIterator<GhostTwodaOut> => iterate<Raw2da, GhostTwodaOut>(
  twodas,
  (twoda, i) => {
    const skeleton = buildTwodaSkeleton(twoda);
    const ghostTwoda = toGhost(twoda);

    const percent = Math.round((i + 1) * 100 / twodas.length);
    reportProgress({
      value: percent,
      step: 'twoda_json2ghost',
      params: {
        resourceName: twoda.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: twoda.resourceName,
      skeleton,
      twoda: ghostTwoda,
    });
  },
);
