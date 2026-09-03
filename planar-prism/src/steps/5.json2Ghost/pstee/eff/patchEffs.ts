import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildEffSkeleton } from './2.buildEffSkeleton.js';

import type { RawEffV20 } from '@/steps/4.biffs2json/pstee/eff/index.js';

import type { GhostEffOut } from './patchEffs.types.js';

export const patchEffs = (
  effs: RawEffV20[],
): AsyncIterableIterator<GhostEffOut> => iterate<RawEffV20, GhostEffOut>(
  effs,
  (eff, i) => {
    const ghostEff = toGhost(eff);
    const skeleton = buildEffSkeleton(ghostEff);

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
