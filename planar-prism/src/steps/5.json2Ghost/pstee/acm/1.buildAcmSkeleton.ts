import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '../../../5.json2Ghost/shared.js';

import type { RawAcm } from '../../../4.biffs2json/pstee/acm/index.js';

export const buildAcmSkeleton = (acm: RawAcm): string => {
  const writer = createWriter();
  const id = acm.resourceName.split('.')[0]!;

  writer.writeLine(`import type { GhostAcm } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${acm.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}AcmSkeleton = () => {`);
  writer.writeLine(`const acm: GhostAcm = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(acm.resourceName)}',`, 4);
  writer.writeLine(`container: '${acm.container}',`, 4);
  writer.writeLine(`audioName: '${escapeSingleQuote(acm.audioName)}',`, 4);
  writer.writeLine(`channels: ${acm.channels},`, 4);
  writer.writeLine(`sampleRate: ${acm.sampleRate},`, 4);
  writer.writeLine(`bitsPerSample: ${acm.bitsPerSample},`, 4);
  writer.writeLine(`sampleCount: ${acm.sampleCount},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return acm;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}AcmSkeleton;`);

  return writer.done();
};
