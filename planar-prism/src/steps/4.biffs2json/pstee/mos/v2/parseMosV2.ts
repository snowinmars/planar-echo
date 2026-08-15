import { encodeRgbaPng } from '../../tis/shared/writePng.js';
import { parseHeader } from './parsers/1.parseHeader.js';
import { nothing } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawPvrRgbaImage } from '../../pvrz/decode/index.js';
import type { RawMosV2, RawMosV2Block, RawMosV2Artifacts } from './parseMosV2.types.js';
import type { Maybe } from '@planar/shared';

const pvrzFileNameForMosPage = (page: number): Maybe<string> => {
  if (page < 0 || page >= 100000) return nothing();
  return `mos${page.toString().padStart(4, '0')}.pvrz`;
};

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

type ParseMosV2Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>;
}>;
export const parseMosV2 = ({
  reader,
  resourceName,
  pvrzRgbaIndex,
}: ParseMosV2Props): RawMosV2Artifacts => {
  const header = parseHeader(reader, resourceName);

  const canvas = Buffer.alloc(header.width * header.height * 4, 0);
  const blocks: RawMosV2Block[] = [];

  const blockReader = reader.fork(header.blocksOffset);
  for (let blockIdx = 0; blockIdx < header.blockCount; blockIdx++) {
    const page = blockReader.int();
    const sourceX = blockReader.uint();
    const sourceY = blockReader.uint();
    const width = blockReader.uint();
    const height = blockReader.uint();
    const targetX = blockReader.uint();
    const targetY = blockReader.uint();

    const pvrzResourceName = pvrzFileNameForMosPage(page);
    if (!pvrzResourceName) throw new Error(`Invalid PVRZ page '${page}' in block '${blockIdx}' for resource '${resourceName}'`);

    const image = pvrzRgbaIndex.get(pvrzResourceName);
    if (!image) throw new Error(`Missing PVRZ '${pvrzResourceName}' in block '${blockIdx}' for resource '${resourceName}'`);

    cropAndBlit({
      canvas,
      canvasWidth: header.width,
      canvasHeight: header.height,
      image,
      sourceX,
      sourceY,
      width,
      height,
      targetX,
      targetY,
    });

    blocks.push({
      index: blockIdx,
      page,
      pvrzResourceName,
      sourceX,
      sourceY,
      width,
      height,
      targetX,
      targetY,
    });
  }

  const imageName = `${resourceName}.png`;
  const mos: RawMosV2 = {
    resourceName,
    signature: 'mos',
    variant: 'v2',
    header,
    imageName,
    blocks,
  };

  return {
    mos,
    png: encodeRgbaPng(header.width, header.height, canvas),
  };
};
