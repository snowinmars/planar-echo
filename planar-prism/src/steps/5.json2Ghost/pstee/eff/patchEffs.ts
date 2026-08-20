import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildEffSkeleton } from './1.buildEffSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawEffV20 } from '@/steps/4.biffs2json/pstee/eff/index.js';
import type { GhostEffOut } from './patchEffs.types.js';

export const patchEffs = (
  effs: RawEffV20[],
): AsyncIterableIterator<GhostEffOut> => iterate<RawEffV20, GhostEffOut>(
  effs,
  (eff, i) => {
    const skeleton = buildEffSkeleton(eff);
    const ghostEff = toGhost(eff);

    const percent = Math.round((i + 1) * 100 / effs.length);
    reportProgress({
      value: percent,
      step: 'eff_json2ghost',
      params: {
        resourceName: eff.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: eff.resourceName,
      skeleton,
      eff: ghostEff,
    });
  },
);
