import {
  MOS_BLOCK_DIMENSION,
  MOS_PALETTE_BLOCK_STRIDE,
} from '../../parseMos.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { MosV1IndicesBlockLayout, MosV1BlockMeta } from '../../parseMos.types.js';
import type { MosV1Header } from './1.parseHeader.types.js';

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
  header: MosV1Header;
  blocksCount: number;
  start: number;
  lookups: number[];
}>;
type ParseTileDataResponse = Readonly<{
  blocks: MosV1BlockMeta[];
  indicesLayoutBlocks: MosV1IndicesBlockLayout[];
  indicesChunks: Buffer[];
  indices: Buffer;
}>;
export const parseTileData = ({
  reader,
  header,
  blocksCount,
  start,
  lookups }: ParseTileDataProps): ParseTileDataResponse => {
  const blocks: MosV1BlockMeta[] = [];
  const indicesLayoutBlocks: MosV1IndicesBlockLayout[] = [];
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
