import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { toGhost } from './1.toGhost.js';
import { buildWavSkeleton } from './2.buildWavSkeleton.js';

import type { RawWav } from '@/steps/4.biffs2json/pstee/wav/index.js';

import type { GhostWavOut } from './patchWavs.types.js';

export const patchWavs = (
  wavs: RawWav[],
): AsyncIterableIterator<GhostWavOut> => iterate<RawWav, GhostWavOut>(
  wavs,
  (wav, i) => {
    const ghostWav = toGhost(wav);
    const skeleton = buildWavSkeleton(ghostWav);

    const percent = Math.round((i + 1) * 100 / wavs.length);
    reportProgress({
      value: percent,
      step: 'wav_json2ghost',
      params: {
        resourceName: wav.resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return Promise.resolve({
      resourceName: wav.resourceName,
      skeleton,
      wav: ghostWav,
    });
  },
);
