import { just } from '@planar/shared';
import {
  MOS_BLOCK_DIMENSION,
  MOS_PALETTE_BLOCK_STRIDE,
} from '../../parseMos.types.js';
import { isGreenColorKeyBgra } from '../../../shared/greenColorKey.js';
import { encodeRgbaPng } from '../../../tis/shared/writePng.js';

import type { MosV1BlockMeta } from '../../parseMos.types.js';
import type { MosV1Header } from './1.parseHeader.types.js';

type RenderBlockRgbaProps = Readonly<{
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
}: RenderBlockRgbaProps): Buffer => {
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

type BlitBlockToCanvasProps = Readonly<{
  canvas: Buffer;
  canvasWidth: number;
  left: number;
  top: number;
  blockWidth: number;
  blockHeight: number;
  blockRgba: Buffer;
}>;
const blitBlockToCanvas = ({
  canvas,
  canvasWidth,
  left,
  top,
  blockWidth,
  blockHeight,
  blockRgba,
}: BlitBlockToCanvasProps): void => {
  for (let row = 0; row < blockHeight; row++) {
    const sourceStart = row * blockWidth * 4;
    const sourceEnd = sourceStart + blockWidth * 4;
    const canvasStart = ((top + row) * canvasWidth + left) * 4;
    blockRgba.copy(canvas, canvasStart, sourceStart, sourceEnd);
  }
};

type RenderMosImageProps = Readonly<{
  header: MosV1Header;
  palette: Buffer;
  blocks: MosV1BlockMeta[];
  indicesChunks: Buffer[];
}>;
export const renderMosImage = ({
  header,
  palette,
  blocks,
  indicesChunks,
}: RenderMosImageProps): Buffer => {
  const canvas = Buffer.alloc(header.width * header.height * 4, 0);

  for (let i = 0; i < blocks.length; i++) {
    const block = just(blocks[i]);

    const tilePalette = palette.subarray(
      block.paletteByteOffset,
      block.paletteByteOffset + MOS_PALETTE_BLOCK_STRIDE,
    );
    const blockRgba = formBlockRgba({
      paletteBgra: tilePalette,
      indices: just(indicesChunks[i]),
      width: block.width,
      height: block.height,
    });
    const left = block.col * MOS_BLOCK_DIMENSION;
    const top = block.row * MOS_BLOCK_DIMENSION;
    blitBlockToCanvas({
      canvas: canvas,
      canvasWidth: header.width,
      left: left,
      top: top,
      blockWidth: block.width,
      blockHeight: block.height,
      blockRgba: blockRgba,
    });
  }

  return encodeRgbaPng(header.width, header.height, canvas);
};
