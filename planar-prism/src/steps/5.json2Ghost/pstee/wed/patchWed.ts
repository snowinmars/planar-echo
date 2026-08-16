import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import buildWedSkeleton from './2.buildWedSkeleton.js';

import type { RawWed } from '@/steps/4.biffs2json/pstee/wed/index.js';
import type { GhostWedOut } from './patchWed.types.js';

export const patchWed = (
  weds: RawWed[],
): AsyncIterableIterator<GhostWedOut> => iterate<RawWed, GhostWedOut>(
  weds,
  (wed, i) => {
    const skeleton = buildWedSkeleton(wed);

    const percent = Math.round((i + 1) * 100 / weds.length);
    reportProgress({
      value: percent,
      step: 'wed_json2ghost',
      params: {
        resourceName: wed.resourceName,
        version: wed.header.version,
      },
    });

    return Promise.resolve({
      resourceName: wed.resourceName,
      skeleton,
      wed,
    });
  },
);
