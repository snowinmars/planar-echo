import { just } from '@planar/shared';

import { encodeRgbaPng } from './encodeRgbaPng.js';
import { isGreenColorKeyBgra } from './greenColorKey.js';

const MOS_BLOCK_DIMENSION = 64;

export type MosV1Block = Readonly<{
  col: number;
  row: number;
  width: number;
  height: number;
  paletteByteOffset: number;
}>;

type FormBlockRgbaProps = Readonly<{
  paletteBgra: Buffer;
  indices: Buffer;
  width: number;
  height: number;
}>;

const formBlockRgba = ({
  paletteBgra,
  width,
  height,
  indices,
}: FormBlockRgbaProps): Buffer => {
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const index = just(indices[i]);
    const out = i * 4;
    const pal = index * 4;
    if (isGreenColorKeyBgra(paletteBgra, pal)) {
      rgba[out] = 0;
      rgba[out + 1] = 0;
      rgba[out + 2] = 0;
      rgba[out + 3] = 0;
      continue;
    }
    rgba[out] = paletteBgra[pal + 2]!;
    rgba[out + 1] = paletteBgra[pal + 1]!;
    rgba[out + 2] = paletteBgra[pal]!;
    rgba[out + 3] = 255;
  }
  return rgba;
};

type RenderMosV1Props = Readonly<{
  width: number;
  height: number;
  palette: Buffer;
  paletteBlockStride: number;
  blocks: readonly MosV1Block[];
  indicesChunks: Buffer[];
}>;

export const renderMosV1Png = ({
  width,
  height,
  palette,
  paletteBlockStride,
  blocks,
  indicesChunks,
}: RenderMosV1Props): Promise<Buffer> => {
  const canvas = Buffer.alloc(width * height * 4, 0);

  for (let i = 0; i < blocks.length; i++) {
    const block = just(blocks[i]);
    const tilePalette = palette.subarray(
      block.paletteByteOffset,
      block.paletteByteOffset + paletteBlockStride,
    );
    const blockRgba = formBlockRgba({
      paletteBgra: tilePalette,
      indices: just(indicesChunks[i]),
      width: block.width,
      height: block.height,
    });
    const left = block.col * MOS_BLOCK_DIMENSION;
    const top = block.row * MOS_BLOCK_DIMENSION;
    for (let row = 0; row < block.height; row++) {
      const sourceStart = row * block.width * 4;
      const sourceEnd = sourceStart + block.width * 4;
      const canvasStart = ((top + row) * width + left) * 4;
      blockRgba.copy(canvas, canvasStart, sourceStart, sourceEnd);
    }
  }

  return encodeRgbaPng(width, height, canvas);
};
