import { withoutExtension } from '@planar/shared';

import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { GhostBmpV1 } from '@planar/shared';

export const buildBmpSkeletonV1 = (bmp: GhostBmpV1): string => {
  const writer = createWriter();
  const id = withoutExtension(bmp.resourceName);

  writer.writeLine(`import type { GhostBmpV1 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bmp.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}BmpSkeleton = () => {`);
  writer.writeLine(`const bmp: GhostBmpV1 = {`, 2);
  writer.writeLine(`resourceName: '${escapeSingleQuote(bmp.resourceName)}',`, 4);

  //
  writer.writeLine(`header: {`, 4);
  writer.writeLine(`signature: '${bmp.header.signature}',`, 6);
  writer.writeLine(`version: '${bmp.header.version}',`, 6);
  writer.writeLine(`fileSize: ${bmp.header.fileSize},`, 6);
  writer.writeLine(`rasterDataOffset: ${bmp.header.rasterDataOffset},`, 6);
  writer.writeLine(`infoHeaderSize: ${bmp.header.infoHeaderSize},`, 6);
  writer.writeLine(`width: ${bmp.header.width},`, 6);
  writer.writeLine(`height: ${bmp.header.height},`, 6);
  writer.writeLine(`topDown: ${bmp.header.topDown},`, 6);
  writer.writeLine(`planesCount: ${bmp.header.planesCount},`, 6);
  writer.writeLine(`bitsPerPixel: ${bmp.header.bitsPerPixel},`, 6);
  writer.writeLine(`compression: '${bmp.header.compression}',`, 6);
  writer.writeLine(`imageSize: ${bmp.header.imageSize},`, 6);
  writer.writeLine(`horizontalResolution: ${bmp.header.horizontalResolution},`, 6);
  writer.writeLine(`verticalResolution: ${bmp.header.verticalResolution},`, 6);
  writer.writeLine(`usedColors: ${bmp.header.usedColors},`, 6);
  writer.writeLine(`importantColors: ${bmp.header.importantColors},`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`imageName: '${escapeSingleQuote(bmp.imageName)}',`, 4);

  //
  if (bmp.paletteLayout) {
    writer.writeLine(`paletteLayout: {`, 4);
    writer.writeLine(`format: '${bmp.paletteLayout.format}',`, 6);
    writer.writeLine(`entryBytes: ${bmp.paletteLayout.entryBytes},`, 6);
    writer.writeLine(`entries: ${bmp.paletteLayout.entries},`, 6);
    writer.writeLine(`colorKey: '${bmp.paletteLayout.colorKey}',`, 6);
    writer.writeLine(`},`, 4);
  }

  //
  if (bmp.indicesLayout) {
    writer.writeLine(`indicesLayout: {`, 4);
    writer.writeLine(`format: 'uint8-index',`, 6);
    writer.writeLine(`width: ${bmp.indicesLayout.width},`, 6);
    writer.writeLine(`height: ${bmp.indicesLayout.height},`, 6);
    writer.writeLine(`},`, 4);
  }

  writer.writeLine('};', 2);
  writer.writeLine('return bmp;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}BmpSkeleton;`);

  return writer.done();
};
