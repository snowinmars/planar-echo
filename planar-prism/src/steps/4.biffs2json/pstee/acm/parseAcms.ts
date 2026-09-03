import { readFile } from 'fs/promises';

import { reportProgress } from '@/shared/report.js';
import iterate from '@/steps/iterate.js';

import { detectAudioContainer } from '../shared/audio/index.js';

import type { AcmFile } from './collectAcmFiles.js';
import type { RawAcm } from './parseAcms.types.js';

export const parseAcms = async (
  acms: AcmFile[],
): Promise<AsyncIterableIterator<RawAcm>> => iterate<AcmFile, RawAcm>(
  acms,
  async ({ absPath, resourceName }, i) => {
    const buffer = await readFile(absPath);
    const container = detectAudioContainer(buffer);

    const acm: RawAcm = {
      resourceName,
      container,
      audioName: `${resourceName}.wav`,
      channels: -1,
      sampleRate: -1,
      bitsPerSample: -1,
      sampleCount: -1,
    };

    const percent = Math.round((i + 1) * 100 / acms.length);
    reportProgress({
      value: percent,
      step: 'acm_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return acm;
  },
);
