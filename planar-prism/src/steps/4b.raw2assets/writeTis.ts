import { readFile } from 'fs/promises';
import { join } from 'path';

import { isNothing } from '@planar/shared';

import { pvrzIndexFromSab } from '@/shared/pool/index.js';

import { cropAndBlit } from './algo/cropAndBlit.js';
import { encodeRgbaPng } from './algo/encodeRgbaPng.js';
import { blitTisTileRgba, createTisAtlasBuffer, renderTisPalettePng, TILE_DIMENSION } from './algo/renderTisPalette.js';
import { writeAssetFile } from './writeAssetFile.js';

import type { AssetOk, PackedPvrz, ParseOneProps, ParseOneResult } from '@/shared/pool/index.js';
import type { RawTis } from '@/steps/4.biffs2json/pstee/tis/index.js';

export const writeOneTis = async ({
  resourceName,
  decompiledRoot,
  assetsRoot,
  context,
  payload,
}: ParseOneProps): Promise<ParseOneResult<AssetOk>> => {
  const tis = payload as RawTis;

  if (tis.variant === 'palette') {
    const buffer = await readFile(join(decompiledRoot, resourceName));
    const paletteBytesPerTile = 256 * 4;
    const indicesBytesPerTile = TILE_DIMENSION * TILE_DIMENSION;
    const palette = Buffer.alloc(tis.header.tileCount * paletteBytesPerTile);
    const indices = Buffer.alloc(tis.header.tileCount * indicesBytesPerTile);
    let offset = tis.header.headerSize;

    for (let tileIdx = 0; tileIdx < tis.header.tileCount; tileIdx = tileIdx + 1) {
      buffer.copy(palette, tileIdx * paletteBytesPerTile, offset, offset + paletteBytesPerTile);
      offset = offset + paletteBytesPerTile;
      buffer.copy(indices, tileIdx * indicesBytesPerTile, offset, offset + indicesBytesPerTile);
      offset = offset + indicesBytesPerTile;
    }

    const image = await renderTisPalettePng({
      columns: tis.columns,
      rows: tis.rows,
      tileCount: tis.header.tileCount,
      palette,
      indices,
    });
    await writeAssetFile(assetsRoot, 'tis', `${resourceName}.png`, image);
    await writeAssetFile(assetsRoot, 'tis', `${resourceName}.palette`, palette);
    await writeAssetFile(assetsRoot, 'tis', `${resourceName}.indices`, indices);
    return { value: { ok: true } };
  }

  const packed = context as PackedPvrz;
  const pvrzRgbaIndex = pvrzIndexFromSab(packed.sab, packed.table);
  const atlas = createTisAtlasBuffer(tis.columns, tis.rows);
  const black = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4, 0);

  for (const tile of tis.tiles) {
    if (tile.page === -1 || isNothing(tile.pvrzResourceName) || !tile.pvrzResourceName) {
      blitTisTileRgba(atlas, tis.columns, tile.index, black);
      continue;
    }

    const image = pvrzRgbaIndex.get(tile.pvrzResourceName);
    if (!image) throw new Error(`Missing PVRZ '${tile.pvrzResourceName}' tile '${tile.index}' for resource '${resourceName}'`);

    const tileRgba = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4, 0);
    cropAndBlit({
      canvas: tileRgba,
      canvasWidth: TILE_DIMENSION,
      canvasHeight: TILE_DIMENSION,
      image,
      sourceX: tile.x,
      sourceY: tile.y,
      width: TILE_DIMENSION,
      height: TILE_DIMENSION,
      targetX: 0,
      targetY: 0,
    });
    blitTisTileRgba(atlas, tis.columns, tile.index, tileRgba);
  }

  await writeAssetFile(
    assetsRoot,
    'tis',
    `${resourceName}.png`,
    await encodeRgbaPng(tis.columns * TILE_DIMENSION, tis.rows * TILE_DIMENSION, atlas),
  );
  return { value: { ok: true } };
};
