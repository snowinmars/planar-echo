import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildSrcSkeleton } from './1.buildSrcSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawSrc } from '@/steps/4.biffs2json/pstee/src/index.js';
import type { GhostSrcOut } from './patchSrcs.types.js';

export const patchSrcs = (
  srcs: RawSrc[],
): AsyncIterableIterator<GhostSrcOut> => iterate<RawSrc, GhostSrcOut>(
  srcs,
  (src, i) => {
    const skeleton = buildSrcSkeleton(src);
    const ghostSrc = toGhost(src);

    const percent = Math.round((i + 1) * 100 / srcs.length);
    reportProgress({
      value: percent,
      step: 'src_json2ghost',
      params: {
        resourceName: src.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: src.resourceName,
      skeleton,
      src: ghostSrc,
    });
  },
);
