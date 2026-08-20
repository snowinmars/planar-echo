import { join } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { reportProgress } from '@/shared/report.js';
import { decodeAudioBuffer } from '../shared/audio/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { DecompiledBiff } from '@/steps/3.decompileBiffs/index.js';
import type { RawWav, RawWavArtifacts } from './parseWavs.types.js';

export const parseWavs = (
  paths: Paths,
  decompiledBiffs: DecompiledBiff[],
): AsyncIterableIterator<RawWavArtifacts> => iterate<DecompiledBiff, RawWavArtifacts>(
  decompiledBiffs,
  async ({ resourceName }, i) => {
    const buffer = await readFile(join(paths.ghostDir.decompiledBiff.root, resourceName));

    const decoded = await decodeAudioBuffer(buffer, resourceName);

    const wav: RawWav = {
      resourceName,
      container: decoded.container,
      audioName: `${resourceName}.wav`,
      channels: decoded.pcm.channels,
      sampleRate: decoded.pcm.sampleRate,
      bitsPerSample: decoded.pcm.bitsPerSample,
      sampleCount: decoded.pcm.sampleCount,
    };

    const percent = Math.round((i + 1) * 100 / decompiledBiffs.length);
    reportProgress({
      value: percent,
      step: 'wav_raw2json',
      params: { resourceName },
    });

    return {
      wav,
      pcmWav: decoded.wav,
    };
  },
);
