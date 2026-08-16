import { parseHeader } from './parsers/1.parseHeader.js';
import { parseBmpPalette } from '../shared/parseBmpPalette.js';
import { parseBmpPixels } from '../shared/parseBmpPixels.js';
import { renderBmpImage } from '../shared/renderBmpImage.js';
import { BMP_FILE_HEADER_SIZE } from '../parseBmps.const.js';
import { nothing } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBmpV5, RawBmpV5Artifacts } from './parseBmpV5.types.js';

type ParseBmpV5Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;

export const parseBmpV5 = ({
  reader,
  resourceName,
}: ParseBmpV5Props): RawBmpV5Artifacts => {
  const header = parseHeader(reader, resourceName);

  const entries = header.usedColors === 0 ? 1 << header.bitsPerPixel : header.usedColors;
  const paletteSize = entries * 4;
  const paletteStart = BMP_FILE_HEADER_SIZE + header.infoHeaderSize;
  const paletteEnd = Math.min(paletteStart + paletteSize, header.rasterDataOffset);
  const palette = parseBmpPalette({
    blob: reader.blob(paletteStart, paletteEnd),
    resourceName,
    paletteSize: paletteSize,
    bitsPerPixel: header.bitsPerPixel,
  });

  const pixels = parseBmpPixels({
    blob: reader.blob(header.rasterDataOffset),
    resourceName,
    width: header.width,
    height: header.height,
    topDown: header.topDown,
    bitsPerPixel: header.bitsPerPixel,
    compression: header.compression,
    masks: {
      redMask: header.redMask,
      greenMask: header.greenMask,
      blueMask: header.blueMask,
      alphaMask: header.alphaMask,
    },
  });

  const png = renderBmpImage({
    width: header.width,
    height: header.height,
    bitsPerPixel: header.bitsPerPixel,
    palette,
    indices: pixels.indices,
    rgba: pixels.rgba,
  });

  const imageName = `${resourceName}.png`;
  const bmp: RawBmpV5 = {
    resourceName,
    header,
    imageName,
    paletteLayout: palette
      ? {
          format: 'bgra' as const,
          entryBytes: 4,
          entries: palette.length / 4,
          colorKey: 'green' as const,
        }
      : nothing(),
    indicesLayout: pixels.indices
      ? {
          format: 'uint8-index' as const,
          width: header.width,
          height: header.height,
        }
      : nothing(),
  };

  return {
    bmp,
    png,
    palette,
    indices: pixels.indices,
  };
};
