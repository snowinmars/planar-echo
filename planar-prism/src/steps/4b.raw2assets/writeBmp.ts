import { join } from 'path';
import { readFile } from 'fs/promises';
import { isNothing } from '@planar/shared';
import { isRawBmpV1 } from '@/steps/4.biffs2json/pstee/bmp/isBmpV1.js';
import { parseBmpPalette } from './algo/bmp/parseBmpPalette.js';
import { parseBmpPixels } from './algo/bmp/parseBmpPixels.js';
import { renderBmpImage } from './algo/bmp/renderBmpImage.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { ParseOneProps, ParseOneResult, AssetOk } from '@/shared/pool/index.js';
import type { RawBmp } from '@/steps/4.biffs2json/pstee/bmp/index.js';

const BMP_FILE_HEADER_SIZE = 14;

export const writeOneBmp = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
  payload,
}: ParseOneProps): Promise<ParseOneResult<AssetOk>> => {
  const bmp = payload as RawBmp;
  const buffer = await readFile(join(decompiledRoot, resourceName));
  const header = bmp.header;

  const entries = header.usedColors === 0 ? 1 << header.bitsPerPixel : header.usedColors;
  const paletteSize = entries * 4;
  const paletteStart = BMP_FILE_HEADER_SIZE + header.infoHeaderSize;
  const paletteEnd = Math.min(paletteStart + paletteSize, header.rasterDataOffset);
  const palette = parseBmpPalette({
    blob: buffer.subarray(paletteStart, paletteEnd),
    resourceName,
    paletteSize,
    bitsPerPixel: header.bitsPerPixel,
  });

  const pixels = isRawBmpV1(bmp)
    ? parseBmpPixels({
        blob: buffer.subarray(header.rasterDataOffset),
        resourceName,
        width: header.width,
        height: header.height,
        topDown: header.topDown,
        bitsPerPixel: header.bitsPerPixel,
        compression: header.compression,
      })
    : parseBmpPixels({
        blob: buffer.subarray(header.rasterDataOffset),
        resourceName,
        width: header.width,
        height: header.height,
        topDown: header.topDown,
        bitsPerPixel: header.bitsPerPixel,
        compression: header.compression,
        masks: {
          redMask: bmp.header.redMask,
          greenMask: bmp.header.greenMask,
          blueMask: bmp.header.blueMask,
          alphaMask: bmp.header.alphaMask,
        },
      });

  const image = await renderBmpImage({
    width: header.width,
    height: header.height,
    bitsPerPixel: header.bitsPerPixel,
    palette,
    indices: pixels.indices,
    rgba: pixels.rgba,
  });

  await writeAssetFile(assetsRoot, 'bmp', `${resourceName}.png`, image);
  if (!isNothing(palette) && !isNothing(pixels.indices)) {
    await writeAssetFile(assetsRoot, 'bmp', `${resourceName}.palette`, palette);
    await writeAssetFile(assetsRoot, 'bmp', `${resourceName}.indices`, pixels.indices);
  }

  return { value: { ok: true } };
};
