import { join } from 'path';
import { readFile } from 'fs/promises';
import { decodeAudioBuffer } from './algo/audio/index.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult } from '@/shared/pool/index.js';
import type { RawWav } from '@/steps/4.biffs2json/pstee/wav/parseWavs.types.js';

export type WavAssetResult = Readonly<{
  ok: true;
  wav: RawWav;
}>;

export const writeOneWav = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
}: ParseOneProps): Promise<ParseOneResult<WavAssetResult>> => {
  const buffer = await readFile(join(decompiledRoot, resourceName));
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

  await writeAssetFile(assetsRoot, 'wav', `${resourceName}.wav`, decoded.wav);

  return {
    value: {
      ok: true,
      wav,
    },
  };
};
