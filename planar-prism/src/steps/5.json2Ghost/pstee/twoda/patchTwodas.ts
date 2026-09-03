import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildTwodaSkeleton } from './2.buildTwodaSkeleton.js';

import type { RawTwoda } from '@/steps/4.biffs2json/pstee/2da/index.js';

import type { GhostTwodaOut } from './patchTwodas.types.js';

export const patchTwodas = (
  twodas: RawTwoda[],
): AsyncIterableIterator<GhostTwodaOut> => iterate<RawTwoda, GhostTwodaOut>(
  twodas,
  (twoda, i) => {
    const ghostTwoda = toGhost(twoda);
    const skeleton = buildTwodaSkeleton(ghostTwoda);

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
