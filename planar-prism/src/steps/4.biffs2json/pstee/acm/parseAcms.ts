import { join, basename } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { entryExists } from '@/shared/customFs.js';
import { reportProgress } from '@/shared/report.js';
import { decodeAudioBuffer } from '../shared/audio/index.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { RawAcm, RawAcmArtifacts } from './parseAcms.types.js';
import { walkFiles } from '../shared/walkFiles.js';

type AcmFile = Readonly<{
  resourceName: string;
  absPath: string;
}>;

const collectAcmFiles = async (musicDir: string): Promise<AcmFile[]> => {
  const files = await walkFiles(musicDir);
  return files
    .filter(path => path.toLowerCase().endsWith('.acm'))
    .map((absPath) => {
      return {
        resourceName: basename(absPath),
        absPath,
      };
    });
};

export const parseAcms = async (
  paths: Paths,
): Promise<AsyncIterableIterator<RawAcmArtifacts>> => {
  const musicDir = join(paths.gameDir, 'music');
  const exists = await entryExists(musicDir);
  if (!exists) throw new Error(`Music directory '${musicDir}' is not found.`);
  const files = exists ? await collectAcmFiles(musicDir) : [];

  return iterate<AcmFile, RawAcmArtifacts>(
    files,
    async (file, i) => {
      const buffer = await readFile(file.absPath);

      const decoded = await decodeAudioBuffer(buffer, file.resourceName);

      const acm: RawAcm = {
        resourceName: file.resourceName,
        container: decoded.container,
        audioName: `${file.resourceName}.wav`,
        channels: decoded.pcm.channels,
        sampleRate: decoded.pcm.sampleRate,
        bitsPerSample: decoded.pcm.bitsPerSample,
        sampleCount: decoded.pcm.sampleCount,
      };

      const percent = Math.round((i + 1) * 100 / files.length);
      reportProgress({
        value: percent,
        step: 'acm_raw2json',
        params: {
          version: decoded.container,
          resourceName: file.resourceName,
        },
      });

      return {
        acm,
        pcmWav: decoded.wav,
      };
    },
  );
};
