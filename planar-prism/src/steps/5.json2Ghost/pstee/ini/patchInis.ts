import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildIniSkeleton } from './1.buildIniSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawIni } from '@/steps/4.biffs2json/pstee/ini/index.js';
import type { GhostIniOut } from './patchInis.types.js';

export const patchInis = (
  inis: RawIni[],
): AsyncIterableIterator<GhostIniOut> => iterate<RawIni, GhostIniOut>(
  inis,
  (ini, i) => {
    const skeleton = buildIniSkeleton(ini);
    const ghostIni = toGhost(ini);

    const percent = Math.round((i + 1) * 100 / inis.length);
    reportProgress({
      value: percent,
      step: 'ini_json2ghost',
      params: {
        resourceName: ini.resourceName,
      },
    });

    return Promise.resolve({
      resourceName: ini.resourceName,
      skeleton,
      ini: ghostIni,
    });
  },
);
