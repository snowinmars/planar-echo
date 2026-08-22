import { parseHeader } from './parsers/1.parseHeader.js';
import { parseBmpPalette } from '../shared/parseBmpPalette.js';
import { parseBmpPixels } from '../shared/parseBmpPixels.js';
import { renderBmpImage } from '../shared/renderBmpImage.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBmpV1, RawBmpV1Artifacts } from './parseBmpV1.types.js';
import { nothing } from '@planar/shared';

const BMP_FILE_HEADER_SIZE = 14;

type ParseBmpV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseBmpV1 = async ({
  reader,
  resourceName,
}: ParseBmpV1Props): Promise<RawBmpV1Artifacts> => {
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
  });

  const image = await renderBmpImage({
    width: header.width,
    height: header.height,
    bitsPerPixel: header.bitsPerPixel,
    palette,
    indices: pixels.indices,
    rgba: pixels.rgba,
  });

  const imageName = `${resourceName}.png`;
  const bmp: RawBmpV1 = {
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
    image,
    palette,
    indices: pixels.indices,
  };
};
