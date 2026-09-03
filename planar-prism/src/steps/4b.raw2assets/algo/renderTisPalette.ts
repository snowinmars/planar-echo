import { encodeRgbaPng } from './encodeRgbaPng.js';
import { isGreenColorKeyBgra } from './greenColorKey.js';

export const TILE_DIMENSION = 64;

const renderTileRgba = (paletteBgra: Buffer, indices: Buffer): Buffer => {
  const rgba = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4);
  for (let i = 0; i < TILE_DIMENSION * TILE_DIMENSION; i++) {
    const index = indices[i]!;
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

const blitTileRgba = (
  atlas: Buffer,
  atlasColumns: number,
  tileIndex: number,
  tileRgba: Buffer,
): void => {
  const atlasWidthPx = atlasColumns * TILE_DIMENSION;
  const tileX = (tileIndex % atlasColumns) * TILE_DIMENSION;
  const tileY = Math.floor(tileIndex / atlasColumns) * TILE_DIMENSION;

  for (let row = 0; row < TILE_DIMENSION; row = row + 1) {
    const srcOffset = row * TILE_DIMENSION * 4;
    const dstOffset = ((tileY + row) * atlasWidthPx + tileX) * 4;
    tileRgba.copy(atlas, dstOffset, srcOffset, srcOffset + TILE_DIMENSION * 4);
  }
};

type RenderTisPalettePngProps = Readonly<{
  columns: number;
  rows: number;
  tileCount: number;
  palette: Buffer;
  indices: Buffer;
}>;

export const renderTisPalettePng = ({
  columns,
  rows,
  tileCount,
  palette,
  indices,
}: RenderTisPalettePngProps): Promise<Buffer> => {
  const atlas = Buffer.alloc(columns * TILE_DIMENSION * rows * TILE_DIMENSION * 4, 0);
  const paletteBytesPerTile = 256 * 4;
  const indicesBytesPerTile = TILE_DIMENSION * TILE_DIMENSION;

  for (let tileIdx = 0; tileIdx < tileCount; tileIdx = tileIdx + 1) {
    const tilePalette = palette.subarray(
      tileIdx * paletteBytesPerTile,
      (tileIdx + 1) * paletteBytesPerTile,
    );
    const tileIndices = indices.subarray(
      tileIdx * indicesBytesPerTile,
      (tileIdx + 1) * indicesBytesPerTile,
    );
    blitTileRgba(atlas, columns, tileIdx, renderTileRgba(tilePalette, tileIndices));
  }

  return encodeRgbaPng(columns * TILE_DIMENSION, rows * TILE_DIMENSION, atlas);
};

export const createTisAtlasBuffer = (columns: number, rows: number): Buffer =>
  Buffer.alloc(columns * TILE_DIMENSION * rows * TILE_DIMENSION * 4, 0);

export const blitTisTileRgba = blitTileRgba;
