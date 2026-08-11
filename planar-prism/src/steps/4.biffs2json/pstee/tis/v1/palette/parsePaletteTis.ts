import { TILE_DIMENSION, calcAtlasColumns, calcAtlasRows, PALETTE_TILE_SIZE } from '../../shared/tisCommon.js';
import { blitTileRgba, createAtlasBuffer, encodeRgbaPng } from '../../shared/writePng.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { Tis, PaletteTisTileMeta } from '../../parseTis.types.js';
import type { TisHeader } from '../1.parseHeader.types.js';
import type { ParsePaletteTisResult } from './parsePaletteTis.types.js';

/**
 * Whole algorithms here are neurogenerated.
 * Docs are dead, NearInfinity and GemRb saved the flow, so...thanks.
 */

const renderTileRgba = (paletteBgra: Buffer, indices: Buffer): Buffer => {
  const rgba = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4);
  for (let i = 0; i < TILE_DIMENSION * TILE_DIMENSION; i++) {
    const index = indices[i]!;
    const out = i * 4;
    if (index === 0) {
      rgba[out] = 0;
      rgba[out + 1] = 0;
      rgba[out + 2] = 0;
      rgba[out + 3] = 0;
      continue;
    }
    const pal = index * 4;
    // BGRA in file → RGBA out; force opaque
    rgba[out] = paletteBgra[pal + 2]!;
    rgba[out + 1] = paletteBgra[pal + 1]!;
    rgba[out + 2] = paletteBgra[pal]!;
    rgba[out + 3] = 255;
  }
  return rgba;
};

type ParsePaletteTisProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  header: TisHeader;
  wedWidth: number | undefined;
}>;
export const parsePaletteTis = ({
  reader,
  resourceName,
  header,
  wedWidth,
}: ParsePaletteTisProps): ParsePaletteTisResult => {
  if (header.tileSize !== PALETTE_TILE_SIZE) throw new Error(`Expected palette tile size '${PALETTE_TILE_SIZE}', got '${header.tileSize}' for resource '${resourceName}'`);

  const { columns, source } = calcAtlasColumns(header.tileCount, wedWidth);
  const rows = calcAtlasRows(header.tileCount, columns);
  const atlas = createAtlasBuffer(columns, rows);

  const palette = Buffer.alloc(header.tileCount * 256 * 4);
  const indices = Buffer.alloc(header.tileCount * TILE_DIMENSION * TILE_DIMENSION);
  const tiles: PaletteTisTileMeta[] = [];

  const dataReader = reader.fork(header.headerSize);

  for (let tileIdx = 0; tileIdx < header.tileCount; tileIdx = tileIdx + 1) {
    const tilePalette = Buffer.alloc(256 * 4);
    for (let p = 0; p < 256; p = p + 1) {
      const b = dataReader.ubyte();
      const g = dataReader.ubyte();
      const r = dataReader.ubyte();
      const a = dataReader.ubyte();
      const off = p * 4;
      tilePalette[off] = b;
      tilePalette[off + 1] = g;
      tilePalette[off + 2] = r;
      tilePalette[off + 3] = a;
    }
    tilePalette.copy(palette, tileIdx * 256 * 4);

    const tileIndices = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION);
    for (let i = 0; i < TILE_DIMENSION * TILE_DIMENSION; i++) tileIndices[i] = dataReader.ubyte();
    tileIndices.copy(indices, tileIdx * TILE_DIMENSION * TILE_DIMENSION);

    const tileRgba = renderTileRgba(tilePalette, tileIndices);
    blitTileRgba(atlas, columns, tileIdx, tileRgba);
    tiles.push({ index: tileIdx });
  }

  const imageName = `${resourceName}.png`;
  const paletteName = `${resourceName}.palette`;
  const indicesName = `${resourceName}.indices`;

  const tis: Tis = {
    resourceName,
    header,
    variant: 'palette',
    columns,
    rows,
    atlasWidthSource: source,
    imageName: imageName,
    paletteName: paletteName,
    indicesName: indicesName,
    tiles,
  };

  return {
    tis,
    png: encodeRgbaPng(columns * TILE_DIMENSION, rows * TILE_DIMENSION, atlas),
    palette,
    indices,
  };
};
