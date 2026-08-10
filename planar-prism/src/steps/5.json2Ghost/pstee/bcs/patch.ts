import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildScriptSkeleton } from './buildScriptSkeleton.js';

import type { Bcs } from '@/steps/4.biffs2json/pstee/bcs/index.js';
import type { DiscoverNext } from '@/discoverer.types.js';

export type GhostBcs = Readonly<{
  resourceName: string;
  skeleton: string;
}>;

export const patchBcs = (
  bcsList: Bcs[],
  discover: DiscoverNext,
): AsyncIterableIterator<GhostBcs> => iterate<Bcs, GhostBcs>(
  bcsList,
  (bcs, i) => {
    const skeleton = buildScriptSkeleton(bcs, discover);
    const percent = Math.round((i + 1) * 100 / Math.max(bcsList.length, 1));
    reportProgress({
      value: percent,
      step: 'bcs_json2ghost',
      params: { resourceName: bcs.resourceName },
    });
    return Promise.resolve({
      resourceName: bcs.resourceName,
      skeleton,
    });
  },
);
