import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostPvr } from '@planar/shared';

export const buildPvrSkeleton = (pvr: GhostPvr): string => {
  const writer = createWriter();
  const id = withoutExtension(pvr.resourceName);

  writer.writeLine(`import type { GhostPvr } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${pvr.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}PvrSkeleton = () => {`);
  writer.writeLine(`const pvr: GhostPvr = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(pvr.resourceName)}',`, 4);
  writer.writeLine(`signature: ${pvr.signature},`, 4);
  writer.writeLine(`flags: ${pvr.flags},`, 4);
  writer.writeLine(`pixelFormat: '${pvr.pixelFormat}',`, 4);
  writer.writeLine(`colorSpace: ${pvr.colorSpace},`, 4);
  writer.writeLine(`channelType: ${pvr.channelType},`, 4);
  writer.writeLine(`height: ${pvr.height},`, 4);
  writer.writeLine(`width: ${pvr.width},`, 4);
  writer.writeLine(`depth: ${pvr.depth},`, 4);
  writer.writeLine(`numSurfaces: ${pvr.numSurfaces},`, 4);
  writer.writeLine(`numFaces: ${pvr.numFaces},`, 4);
  writer.writeLine(`mipmapCount: ${pvr.mipmapCount},`, 4);
  writer.writeLine(`metadataSize: ${pvr.metadataSize},`, 4);
  writer.writeLine(`pixelDataOffset: ${pvr.pixelDataOffset},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return pvr;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}PvrSkeleton;`);

  return writer.done();
};
