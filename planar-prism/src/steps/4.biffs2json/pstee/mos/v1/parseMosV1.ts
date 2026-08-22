import { parseHeader } from './parsers/1.parseHeader.js';
import { parsePalette } from './parsers/2.parsePalettes .js';
import { parseLookups } from './parsers/3.parseLookups.js';
import { parseTileData } from './parsers/4.parseTileData.js';
import { renderMosImage } from './parsers/5.renderMosImage.js';
import {
  MOS_PALETTE_BLOCK_STRIDE,
  MOS_PALETTE_ENTRIES,
  MOS_PALETTE_ENTRY_BYTES,
} from '../parseMoss.const.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawMosV1, RawMosV1Artifacts } from './parseMosV1.types.js';

type ParseMosV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseMosV1 = async ({
  reader,
  resourceName,
}: ParseMosV1Props): Promise<RawMosV1Artifacts> => {
  const header = parseHeader(reader, resourceName);

  // absolute position of MOS V1 Palettes section
  const blocksCount = header.columns * header.rows;

  // absolute position of MOS V1 Tile offsets section
  const tileOffset = header.paletteOffset + blocksCount * MOS_PALETTE_BLOCK_STRIDE;

  // absolute position of MOS V1 Tile data section;
  const tileDataOffset = tileOffset + blocksCount * 4;

  const palette = parsePalette({
    reader,
    resourceName,
    start: header.paletteOffset,
    end: tileOffset,
  });

  const lookups = parseLookups({
    reader: reader.fork(tileOffset),
    blocksCount,
  });

  const tileData = parseTileData({
    reader,
    header,
    blocksCount,
    start: tileDataOffset,
    lookups,
  });
  const image = await renderMosImage({
    header,
    palette,
    blocks: tileData.blocks,
    indicesChunks: tileData.indicesChunks,
  });

  const imageName = `${resourceName}.png`;
  const mos: RawMosV1 = {
    resourceName,
    signature: 'mos',
    variant: 'v1',
    header,
    imageName,
    paletteLayout: {
      format: 'bgra',
      entryBytes: MOS_PALETTE_ENTRY_BYTES,
      entriesPerBlock: MOS_PALETTE_ENTRIES,
      blocksCount,
      blockStride: MOS_PALETTE_BLOCK_STRIDE,
      colorKey: 'green',
    },
    indicesLayout: {
      format: 'uint8-index',
      blocks: tileData.indicesLayoutBlocks,
    },
    blocks: tileData.blocks,
  };

  return {
    mos,
    image,
    palette,
    indices: tileData.indices,
  };
};
