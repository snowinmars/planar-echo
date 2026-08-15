import { patchWithTranslation } from './1.patchTranslation.js';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildItmSkeleton } from './2.buildItmSkeleton.js';

import type { RawTlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { RawItmV10 } from '@/steps/4.biffs2json/pstee/itm/parseItms.types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { ItmOut } from './patchItms.types.js';

export const patchItms = (
  cres: RawItmV10[],
  tlk: RawTlk,
  discover: DiscoverNext,
): AsyncIterableIterator<ItmOut> => iterate<RawItmV10, ItmOut>(
  cres,
  (cre, i) => {
    const tlked = patchWithTranslation(cre, tlk);

    const skeleton = buildItmSkeleton(tlked, discover);

    const percent = Math.round((i + 1) * 100 / cres.length);
    reportProgress({
      value: percent,
      step: 'itm_json2ghost',
      params: {
        version: cre.header.version,
        resourceName: cre.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: cre.resourceName,
      skeleton,
      itm: tlked,
    });
  },
);
