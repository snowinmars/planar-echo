import iterate from '../../../iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildAcmSkeleton } from './1.buildAcmSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawAcm } from '../../../4.biffs2json/pstee/acm/index.js';
import type { GhostAcmOut } from './patchAcms.types.js';

export const patchAcms = (
  acms: RawAcm[],
): AsyncIterableIterator<GhostAcmOut> => iterate<RawAcm, GhostAcmOut>(
  acms,
  (acm, i) => {
    const skeleton = buildAcmSkeleton(acm);
    const ghostAcm = toGhost(acm);

    const percent = Math.round((i + 1) * 100 / acms.length);
    reportProgress({
      value: percent,
      step: 'acm_json2ghost',
      params: {
        resourceName: acm.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: acm.resourceName,
      skeleton,
      acm: ghostAcm,
    });
  },
);
