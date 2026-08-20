import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildItmSkeleton } from './1.buildItmSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawItmV10 } from '@/steps/4.biffs2json/pstee/itm/parseItms.types.js';
import type { DiscoverNext } from '@/discoverer.types.js';
import type { ItmOut } from './patchItms.types.js';

// TODO [snow]: in pstee itm v10 is itm v11 or something like that.
// Write this comment as you are not dumb
export const patchItms = (
  itms: RawItmV10[],
  discover: DiscoverNext,
): AsyncIterableIterator<ItmOut> => iterate<RawItmV10, ItmOut>(
  itms,
  (itm, i) => {
    const skeleton = buildItmSkeleton(itm, discover);
    const ghostItm = toGhost(itm);

    const percent = Math.round((i + 1) * 100 / itms.length);
    reportProgress({
      value: percent,
      step: 'itm_json2ghost',
      params: {
        resourceName: itm.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: itm.resourceName,
      skeleton,
      itm: ghostItm,
    });
  },
);
