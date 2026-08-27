import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostBmpV5 } from '@planar/shared';

export const buildBmpSkeletonV5 = (bmp: GhostBmpV5): string => {
  const writer = createWriter();
  const id = withoutExtension(bmp.resourceName);

  writer.writeLine(`import type { GhostBmpV5 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${bmp.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}BmpSkeleton = () => {`);
  writer.writeLine(`const bmp: GhostBmpV5 = {`, 2);
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
  writer.writeLine(`horizontalResolution: ${bmp.header.horizontalResolution},`, 6);
  writer.writeLine(`verticalResolution: ${bmp.header.verticalResolution},`, 6);
  writer.writeLine(`imageSize: ${bmp.header.imageSize},`, 6);
  writer.writeLine(`usedColors: ${bmp.header.usedColors},`, 6);
  writer.writeLine(`importantColors: ${bmp.header.importantColors},`, 6);
  writer.writeLine(`redMask: ${bmp.header.redMask},`, 6);
  writer.writeLine(`greenMask: ${bmp.header.greenMask},`, 6);
  writer.writeLine(`blueMask: ${bmp.header.blueMask},`, 6);
  writer.writeLine(`alphaMask: ${bmp.header.alphaMask},`, 6);
  writer.writeLine(`colorSpaceType: ${bmp.header.colorSpaceType},`, 6);
  writer.writeLine(`redX: ${bmp.header.redX},`, 6);
  writer.writeLine(`redY: ${bmp.header.redY},`, 6);
  writer.writeLine(`redZ: ${bmp.header.redZ},`, 6);
  writer.writeLine(`greenX: ${bmp.header.greenX},`, 6);
  writer.writeLine(`greenY: ${bmp.header.greenY},`, 6);
  writer.writeLine(`greenZ: ${bmp.header.greenZ},`, 6);
  writer.writeLine(`blueX: ${bmp.header.blueX},`, 6);
  writer.writeLine(`blueY: ${bmp.header.blueY},`, 6);
  writer.writeLine(`blueZ: ${bmp.header.blueZ},`, 6);
  writer.writeLine(`gammaRed: ${bmp.header.gammaRed},`, 6);
  writer.writeLine(`gammaGreen: ${bmp.header.gammaGreen},`, 6);
  writer.writeLine(`gammaBlue: ${bmp.header.gammaBlue},`, 6);
  writer.writeLine(`intent: ${bmp.header.intent},`, 6);
  writer.writeLine(`profileData: ${bmp.header.profileData},`, 6);
  writer.writeLine(`profileSize: ${bmp.header.profileSize},`, 6);
  writer.writeLine(`},`, 4);

  writer.writeLine(`imageName: '${escapeSingleQuote(bmp.imageName)}',`, 4);

  if (bmp.paletteLayout) {
    writer.writeLine(`paletteLayout: {`, 4);
    writer.writeLine(`format: 'bgra',`, 6);
    writer.writeLine(`entryBytes: ${bmp.paletteLayout.entryBytes},`, 6);
    writer.writeLine(`entries: ${bmp.paletteLayout.entries},`, 6);
    writer.writeLine(`colorKey: 'green',`, 6);
    writer.writeLine(`},`, 4);
  }

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
