import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildMusSkeleton } from './2.buildMusSkeleton.js';

import type { RawMus } from '@/steps/4.biffs2json/pstee/mus/index.js';

import type { GhostMusOut } from './patchMuss.types.js';

export const patchMuss = (
  muss: RawMus[],
): AsyncIterableIterator<GhostMusOut> => iterate<RawMus, GhostMusOut>(
  muss,
  (mus, i) => {
    const ghostMus = toGhost(mus);
    const skeleton = buildMusSkeleton(ghostMus);

    const percent = Math.round((i + 1) * 100 / muss.length);
    reportProgress({
      value: percent,
      step: 'mus_json2ghost',
      params: {
        resourceName: mus.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: mus.resourceName,
      skeleton,
      mus: ghostMus,
    });
  },
);
