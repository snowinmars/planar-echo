import {
  MOS_BLOCK_DIMENSION,
  MOS_PALETTE_BLOCK_STRIDE,
} from '../../parseMoss.const.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawMosV1IndicesBlockLayout, RawMosV1BlockMeta } from './4.parseTileData.types.js';
import type { RawMosV1Header } from './1.parseHeader.types.js';

const getBlockWidth = (col: number, columns: number, width: number): number => {
  if (col < columns - 1) return MOS_BLOCK_DIMENSION;
  const rem = width % MOS_BLOCK_DIMENSION;
  return rem === 0 ? MOS_BLOCK_DIMENSION : rem;
};

const getBlockHeight = (row: number, rows: number, height: number): number => {
  if (row < rows - 1) return MOS_BLOCK_DIMENSION;
  const rem = height % MOS_BLOCK_DIMENSION;
  return rem === 0 ? MOS_BLOCK_DIMENSION : rem;
};

type ParseTileDataProps = Readonly<{
  reader: BufferReader;
  header: RawMosV1Header;
  blocksCount: number;
  start: number;
  lookups: number[];
}>;
type ParseTileDataResponse = Readonly<{
  blocks: RawMosV1BlockMeta[];
  indicesLayoutBlocks: RawMosV1IndicesBlockLayout[];
  indicesChunks: Buffer[];
  indices: Buffer;
}>;
export const parseTileData = ({
  reader,
  header,
  blocksCount,
  start,
  lookups }: ParseTileDataProps): ParseTileDataResponse => {
  const blocks: RawMosV1BlockMeta[] = [];
  const indicesLayoutBlocks: RawMosV1IndicesBlockLayout[] = [];
  const indicesChunks: Buffer[] = [];
  let indicesByteOffset = 0;

  for (let blockIdx = 0; blockIdx < blocksCount; blockIdx++) {
    const col = blockIdx % header.columns;
    const row = Math.floor(blockIdx / header.columns);
    const width = getBlockWidth(col, header.columns, header.width);
    const height = getBlockHeight(row, header.rows, header.height);
    const lookupOffset = lookups[blockIdx]!;
    const pixelDataOffset = start + lookupOffset;
    const byteLength = width * height;
    const tileIndices = reader.blob(pixelDataOffset, pixelDataOffset + byteLength);

    blocks.push({
      index: blockIdx,
      col,
      row,
      width,
      height,
      paletteByteOffset: blockIdx * MOS_PALETTE_BLOCK_STRIDE,
      lookupOffset,
      pixelDataOffset,
    });
    indicesLayoutBlocks.push({
      index: blockIdx,
      col,
      row,
      width,
      height,
      byteOffset: indicesByteOffset,
      byteLength,
    });
    indicesChunks.push(tileIndices);
    indicesByteOffset += byteLength;
  }

  return {
    blocks,
    indicesLayoutBlocks,
    indicesChunks,
    indices: Buffer.concat(indicesChunks),
  };
};
