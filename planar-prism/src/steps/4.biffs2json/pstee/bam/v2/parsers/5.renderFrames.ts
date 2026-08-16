import type { RawPvrRgbaImage } from '../../../pvrz/decode/index.js';
import type { RawBamV2FrameEntry } from './2.parseEntries.types.js';
import type { RawBamV2DataBlock } from './4.parseBlocks.types.js';

type CropAndBlitProps = Readonly<{
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
const cropAndBlit = ({
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

type RenderFramesProps = Readonly<{
  resourceName: string;
  frames: RawBamV2FrameEntry[];
  blocks: RawBamV2DataBlock[];
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>;
}>;
export const renderFrames = ({
  resourceName,
  frames,
  blocks,
  pvrzRgbaIndex,
}: RenderFramesProps): Buffer[] => frames.map((frame) => {
  if (frame.width <= 0 || frame.height <= 0) return Buffer.alloc(0);

  const canvas = Buffer.alloc(frame.width * frame.height * 4, 0);
  const end = frame.dataBlockIndex + frame.dataBlockCount;

  for (let i = frame.dataBlockIndex; i < end; i++) {
    const block = blocks[i];

    if (!block) throw new Error(`Missing bam V2 data block '${i}' for resource '${resourceName}'`);

    const image = pvrzRgbaIndex.get(block.pvrzResourceName);

    if (!image) throw new Error(`Missing pvrz '${block.pvrzResourceName}' in BAM '${resourceName}'`);

    cropAndBlit({
      canvas,
      canvasWidth: frame.width,
      canvasHeight: frame.height,
      image,
      sourceX: block.sourceX,
      sourceY: block.sourceY,
      width: block.width,
      height: block.height,
      targetX: block.targetX,
      targetY: block.targetY,
    });
  }

  return canvas;
});
