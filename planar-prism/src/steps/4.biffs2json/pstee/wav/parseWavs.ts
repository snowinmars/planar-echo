import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { detectAudioContainer } from '../shared/audio/index.js';
import { reportProgress } from '@/shared/report.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawWav } from './parseWavs.types.js';

export const parseWavs = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawWav> => iterate<DecompiledBiff, RawWav>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));
    const container = detectAudioContainer(buffer);

    const wav: RawWav = {
      resourceName,
      container,
      audioName: `${resourceName}.wav`,
      channels: -1,
      sampleRate: -1,
      bitsPerSample: -1,
      sampleCount: -1,
    };

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'wav_raw2json',
      params: {
        resourceName,
        rssBytes: process.memoryUsage().rss,
      },
    });

    return wav;
  },
);
