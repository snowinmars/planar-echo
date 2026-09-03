import { nothing } from '@planar/shared';

import { parseHeader } from './parsers/1.parseHeader.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBmpV1 } from './parseBmpV1.types.js';

type ParseBmpV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;

export const parseBmpV1Json = ({
  reader,
  resourceName,
}: ParseBmpV1Props): RawBmpV1 => {
  const header = parseHeader(reader, resourceName);
  const paletted = header.bitsPerPixel <= 8;
  const entries = header.usedColors === 0 ? 1 << header.bitsPerPixel : header.usedColors;

  return {
    resourceName,
    header,
    imageName: `${resourceName}.png`,
    paletteLayout: paletted
      ? {
          format: 'bgra' as const,
          entryBytes: 4,
          entries,
          colorKey: 'green' as const,
        }
      : nothing(),
    indicesLayout: paletted
      ? {
          format: 'uint8-index' as const,
          width: header.width,
          height: header.height,
        }
      : nothing(),
  };
};
