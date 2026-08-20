import iterate from '../../../iterate.js';
import { reportProgress } from '@/shared/report.js';
import { buildBamSkeleton } from './1.buildBamSkeleton.js';
import { toGhost } from './2.toGhost.js';

import type { RawBam } from '../../../4.biffs2json/pstee/bam/index.js';
import type { GhostBamOut } from './patchBams.types.js';

export const patchBams = (
  bams: RawBam[],
): AsyncIterableIterator<GhostBamOut> => iterate<RawBam, GhostBamOut>(
  bams,
  (bam, i) => {
    const skeleton = buildBamSkeleton(bam);
    const ghostBam = toGhost(bam);

    const percent = Math.round((i + 1) * 100 / bams.length);
    reportProgress({
      value: percent,
      step: 'bam_json2ghost',
      params: {
        resourceName: bam.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: bam.resourceName,
      skeleton,
      bam: ghostBam,
    });
  },
);
