import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostWav } from '@planar/shared';

export const buildWavSkeleton = (wav: GhostWav): string => {
  const writer = createWriter();
  const id = withoutExtension(wav.resourceName);

  writer.writeLine(`import type { GhostWav } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${wav.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}WavSkeleton = () => {`);
  writer.writeLine(`const wav: GhostWav = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(wav.resourceName)}',`, 4);
  writer.writeLine(`container: '${wav.container}',`, 4);
  writer.writeLine(`audioName: '${escapeSingleQuote(wav.audioName)}',`, 4);
  writer.writeLine(`channels: ${wav.channels},`, 4);
  writer.writeLine(`sampleRate: ${wav.sampleRate},`, 4);
  writer.writeLine(`bitsPerSample: ${wav.bitsPerSample},`, 4);
  writer.writeLine(`sampleCount: ${wav.sampleCount},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return wav;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}WavSkeleton;`);

  return writer.done();
};
