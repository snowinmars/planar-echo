import { encodeRgbaPng } from '../../tis/shared/writePng.js';
import { MOS_V2_BLOCK_SIZE } from '../parseMos.types.js';
import { parseHeader } from './parsers/1.parseHeader.js';
import { nothing } from '@planar/shared';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RgbaImage } from '../../pvrz/decode/index.js';
import type { MosV2, MosV2Block, ParsedMosV2Artifacts } from '../parseMos.types.js';
import type { Maybe } from '@planar/shared';

const pvrzFileNameForMosPage = (page: number): Maybe<string> => {
  if (page < 0 || page >= 100000) return nothing();
  return `mos${page.toString().padStart(4, '0')}.pvrz`;
};

type CropAndBlitProps = Readonly<{
  canvas: Buffer;
  canvasWidth: number;
  canvasHeight: number;
  image: RgbaImage;
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
  pvrzRgbaIndex: Map<string, RgbaImage>;
}>;
export const parseMosV2 = ({
  reader,
  resourceName,
  pvrzRgbaIndex,
}: ParseMosV2Props): ParsedMosV2Artifacts => {
  const header = parseHeader(reader, resourceName);

  const canvas = Buffer.alloc(header.width * header.height * 4, 0);
  const blocks: MosV2Block[] = [];

  for (let blockIdx = 0; blockIdx < header.blockCount; blockIdx++) {
    const ofs = header.blocksOffset + (blockIdx * MOS_V2_BLOCK_SIZE);
    const page = reader.buffer.readInt32LE(ofs); // TODO [snow]: to reader.uint
    const sourceX = reader.buffer.readUInt32LE(ofs + 4);
    const sourceY = reader.buffer.readUInt32LE(ofs + 8);
    const width = reader.buffer.readUInt32LE(ofs + 12);
    const height = reader.buffer.readUInt32LE(ofs + 16);
    const targetX = reader.buffer.readUInt32LE(ofs + 20);
    const targetY = reader.buffer.readUInt32LE(ofs + 24);

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
  const mos: MosV2 = {
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
