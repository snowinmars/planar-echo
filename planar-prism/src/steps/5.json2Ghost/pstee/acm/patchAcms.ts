import iterate from '../../../iterate.js';
import { reportProgress } from '@/shared/report.js';
import { toGhost } from './1.toGhost.js';
import { buildAcmSkeleton } from './2.buildAcmSkeleton.js';

import type { RawAcm } from '../../../4.biffs2json/pstee/acm/index.js';
import type { GhostAcmOut } from './patchAcms.types.js';

export const patchAcms = (
  acms: RawAcm[],
): AsyncIterableIterator<GhostAcmOut> => iterate<RawAcm, GhostAcmOut>(
  acms,
  (acm, i) => {
    const ghostAcm = toGhost(acm);
    const skeleton = buildAcmSkeleton(ghostAcm);

    const percent = Math.round((i + 1) * 100 / acms.length);
    reportProgress({
      value: percent,
      step: 'acm_json2ghost',
      params: {
        resourceName: acm.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: acm.resourceName,
      skeleton,
      acm: ghostAcm,
    });
  },
);
