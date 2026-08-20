import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildMusSkeleton } from './1.buildMusSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawMus } from '@/steps/4.biffs2json/pstee/mus/index.js';
import type { GhostMusOut } from './patchMuss.types.js';

export const patchMuss = (
  muss: RawMus[],
): AsyncIterableIterator<GhostMusOut> => iterate<RawMus, GhostMusOut>(
  muss,
  (mus, i) => {
    const skeleton = buildMusSkeleton(mus);
    const ghostMus = toGhost(mus);

    const percent = Math.round((i + 1) * 100 / muss.length);
    reportProgress({
      value: percent,
      step: 'mus_json2ghost',
      params: {
        resourceName: mus.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: mus.resourceName,
      skeleton,
      mus: ghostMus,
    });
  },
);
