import patchWithTranslation from './1.patchTranslation.js';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import buildCreSkeleton from './2.buildCreSkeleton.js';

import type { RawTlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import type { RawCre } from '@/steps/4.biffs2json/pstee/cre/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { CreOut } from './patchCres.types.js';

export const patchCres = (
  cres: RawCre[],
  tlk: RawTlk,
  discover: DiscoverNext,
): AsyncIterableIterator<CreOut> => iterate<RawCre, CreOut>(
  cres,
  (cre, i) => {
    const tlked = patchWithTranslation(cre, tlk);

    const ghostCreSkeleton = buildCreSkeleton(tlked, discover);

    const percent = Math.round((i + 1) * 100 / cres.length);
    reportProgress({
      value: percent,
      step: 'cre_json2ghost',
      params: {
        version: cre.header.version,
        resourceName: cre.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: cre.resourceName,
      skeleton: ghostCreSkeleton,
      cre: tlked,
    });
  },
);
