import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildIniSkeleton } from './2.buildIniSkeleton.js';

import type { RawIni } from '@/steps/4.biffs2json/pstee/ini/index.js';

import type { GhostIniOut } from './patchInis.types.js';

export const patchInis = (
  inis: RawIni[],
): AsyncIterableIterator<GhostIniOut> => iterate<RawIni, GhostIniOut>(
  inis,
  (ini, i) => {
    const ghostIni = toGhost(ini);
    const skeleton = buildIniSkeleton(ghostIni);

    const percent = Math.round((i + 1) * 100 / inis.length);
    reportProgress({
      value: percent,
      step: 'ini_json2ghost',
      params: {
        resourceName: ini.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: ini.resourceName,
      skeleton,
      ini: ghostIni,
    });
  },
);
