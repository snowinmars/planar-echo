import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { BitsPerPixel } from '@/steps/4.biffs2json/pstee/bmp/shared/validateBitsPerPixel.types.js';

type ParseBmpPaletteProps = Readonly<{
  blob: Buffer;
  resourceName: string;
  paletteSize: number;
  bitsPerPixel: BitsPerPixel;
}>;
export const parseBmpPalette = ({
  blob,
  resourceName,
  paletteSize,
  bitsPerPixel,
}: ParseBmpPaletteProps): Maybe<Buffer> => {
  if (bitsPerPixel > 8) return nothing();

  if (blob.length < 4) throw new Error(`Bmp palette missing for resource '${resourceName}'`);

  if (blob.length < paletteSize) {
    const padded = Buffer.alloc(paletteSize, 0);
    blob.copy(padded);
    return padded;
  }
  return blob.subarray(0, paletteSize);
};
