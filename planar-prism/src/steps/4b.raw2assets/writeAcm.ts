import { readFile } from 'fs/promises';
import { decodeAudioBuffer } from './algo/audio/index.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult } from '@/shared/pool/index.js';
import type { RawAcm } from '@/steps/4.biffs2json/pstee/acm/parseAcms.types.js';

export type ParseAcmContext = Readonly<{
  absPathByName: Record<string, string>;
}>;

export type AcmAssetResult = Readonly<{
  ok: true;
  acm: RawAcm;
}>;

export const writeOneAcm = async ({
  resourceName,
  assetsRoot,
  context,
}: ParseOneProps): Promise<ParseOneResult<AcmAssetResult>> => {
  const { absPathByName } = context as ParseAcmContext;
  const absPath = absPathByName[resourceName];
  if (!absPath) throw new Error(`Missing acm path for '${resourceName}'`);

  const buffer = await readFile(absPath);
  const decoded = await decodeAudioBuffer(buffer, resourceName);

  const acm: RawAcm = {
    resourceName,
    container: decoded.container,
    audioName: `${resourceName}.wav`,
    channels: decoded.pcm.channels,
    sampleRate: decoded.pcm.sampleRate,
    bitsPerSample: decoded.pcm.bitsPerSample,
    sampleCount: decoded.pcm.sampleCount,
  };

  await writeAssetFile(assetsRoot, 'acm', `${resourceName}.wav`, decoded.wav);

  return {
    value: {
      ok: true,
      acm,
    },
  };
};
