import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import buildMosSkeleton from './2.buildMosSkeleton.js';

import type { RawMos } from '@/steps/4.biffs2json/pstee/mos/index.js';
import type { GhostMosOut } from './patchMos.types.js';

export const patchMos = (
  moss: RawMos[],
): AsyncIterableIterator<GhostMosOut> => iterate<RawMos, GhostMosOut>(
  moss,
  (mos, i) => {
    const skeleton = buildMosSkeleton(mos);

    const percent = Math.round((i + 1) * 100 / moss.length);
    reportProgress({
      value: percent,
      step: 'mos_json2ghost',
      params: {
        resourceName: mos.resourceName,
        version: mos.header.version,
      },
    });

    return Promise.resolve({
      resourceName: mos.resourceName,
      skeleton,
      mos,
    });
  },
);
