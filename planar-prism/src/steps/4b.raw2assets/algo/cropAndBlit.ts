import type { RawPvrRgbaImage } from './pvrz/dxtDecoder.types.js';

export type CropAndBlitProps = Readonly<{
  canvas: Buffer;
  canvasWidth: number;
  canvasHeight: number;
  image: RawPvrRgbaImage;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
}>;

export const cropAndBlit = ({
  canvas,
  canvasWidth,
  canvasHeight,
  image,
  sourceX,
  sourceY,
  width,
  height,
  targetX,
  targetY,
}: CropAndBlitProps): void => {
  const copyW = Math.min(width, canvasWidth - targetX, image.width - sourceX);
  const copyH = Math.min(height, canvasHeight - targetY, image.height - sourceY);
  if (copyW <= 0 || copyH <= 0) return;

  for (let row = 0; row < copyH; row++) {
    const srcY = sourceY + row;
    const dstY = targetY + row;
    if (srcY < 0 || dstY < 0) continue;
    for (let col = 0; col < copyW; col++) {
      const srcX = sourceX + col;
      const dstX = targetX + col;
      if (srcX < 0 || dstX < 0) continue;
      const src = (srcY * image.width + srcX) * 4;
      const dst = (dstY * canvasWidth + dstX) * 4;
      canvas[dst] = image.data[src]!;
      canvas[dst + 1] = image.data[src + 1]!;
      canvas[dst + 2] = image.data[src + 2]!;
      canvas[dst + 3] = image.data[src + 3]!;
    }
  }
};

export type BlitRgbaFrameProps = Readonly<{
  canvas: Buffer;
  canvasWidth: number;
  canvasHeight: number;
  rgba: Buffer;
  width: number;
  height: number;
  atlasX: number;
  atlasY: number;
}>;

export const blitRgbaFrame = ({
  canvas,
  canvasWidth,
  canvasHeight,
  rgba,
  width,
  height,
  atlasX,
  atlasY,
}: BlitRgbaFrameProps): void => {
  if (atlasX < 0 || atlasY < 0 || width <= 0 || height <= 0) return;
  for (let row = 0; row < height; row++) {
    const dstY = atlasY + row;
    if (dstY < 0 || dstY >= canvasHeight) continue;
    const srcStart = row * width * 4;
    const dstStart = (dstY * canvasWidth + atlasX) * 4;
    rgba.copy(canvas, dstStart, srcStart, srcStart + width * 4);
  }
};
