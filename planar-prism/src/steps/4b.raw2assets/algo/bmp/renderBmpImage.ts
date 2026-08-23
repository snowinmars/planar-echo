import { isGreenColorKey, isGreenColorKeyBgra } from '../greenColorKey.js';
import { encodeRgbaPng } from '../encodeRgbaPng.js';

import { isNothing, type Maybe } from '@planar/shared';

/**
 * Mostly llm generated from gemrb/nearinfinity
 */

type RenderBmpImageProps = Readonly<{
  width: number;
  height: number;
  bitsPerPixel: number;
  palette?: Maybe<Buffer>;
  indices?: Maybe<Buffer>;
  rgba: Buffer;
}>;

export const renderBmpImage = ({
  width,
  height,
  bitsPerPixel,
  palette,
  indices,
  rgba,
}: RenderBmpImageProps): Promise<Buffer> => {
  if (bitsPerPixel <= 8) {
    if (isNothing(palette) || isNothing(indices)) throw new Error('Paletted bmp requires palette and indices');

    const out = Buffer.alloc(width * height * 4, 0);
    for (let i = 0; i < width * height; i++) {
      const index = indices[i] ?? 0;
      const pal = index * 4;
      const dst = i * 4;

      if (isGreenColorKeyBgra(palette, pal)) continue;

      out[dst] = palette[pal + 2] ?? 0;
      out[dst + 1] = palette[pal + 1] ?? 0;
      out[dst + 2] = palette[pal] ?? 0;
      out[dst + 3] = 255;
    }

    return encodeRgbaPng(width, height, out);
  }

  for (let i = 0; i < width * height; i++) {
    const dst = i * 4;

    if (isGreenColorKey(rgba[dst] ?? 0, rgba[dst + 1] ?? 0, rgba[dst + 2] ?? 0)) {
      rgba[dst] = 0;
      rgba[dst + 1] = 0;
      rgba[dst + 2] = 0;
      rgba[dst + 3] = 0;
    }
  }

  return encodeRgbaPng(width, height, rgba);
};
