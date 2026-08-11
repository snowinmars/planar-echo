import { blitTileRgba, createAtlasBuffer, encodeRgbaPng } from '../../shared/writePng.js';
import {
  TILE_DIMENSION,
  calcAtlasColumns,
  calcAtlasRows,
  PVRZ_TILE_SIZE,
  pvrzFileNameForPage,
} from '../../shared/tisCommon.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { PvrzTisTile, Tis } from '../../parseTis.types.js';
import type { RgbaImage } from '../../../pvrz/decode/index.js';
import type { TisHeader } from '../1.parseHeader.types.js';
import type { ParsePvrzTisResult } from './parsePvrzTis.types.js';

const blackTile = (): Buffer => Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4, 0);

const cropTile = (image: RgbaImage, x: number, y: number): Buffer => {
  const out = Buffer.alloc(TILE_DIMENSION * TILE_DIMENSION * 4);
  for (let row = 0; row < TILE_DIMENSION; row = row + 1) {
    const srcY = y + row;
    if (srcY < 0 || srcY >= image.height) continue;
    for (let col = 0; col < TILE_DIMENSION; col = col + 1) {
      const srcX = x + col;
      if (srcX < 0 || srcX >= image.width) continue;
      const src = (srcY * image.width + srcX) * 4;
      const dst = (row * TILE_DIMENSION + col) * 4;
      out[dst] = image.data[src]!;
      out[dst + 1] = image.data[src + 1]!;
      out[dst + 2] = image.data[src + 2]!;
      out[dst + 3] = image.data[src + 3]!;
    }
  }
  return out;
};

type ParsePvrzTisProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  header: TisHeader;
  wedWidth: number | undefined;
  pvrzRgbaIndex: Map<string, RgbaImage>;
}>;
export const parsePvrzTis = ({
  reader,
  resourceName,
  header,
  wedWidth,
  pvrzRgbaIndex,
}: ParsePvrzTisProps): ParsePvrzTisResult => {
  if (header.tileSize !== PVRZ_TILE_SIZE) throw new Error(`Expected pvrz tile size '${PVRZ_TILE_SIZE}', got '${header.tileSize}' for resource '${resourceName}'`);

  const { columns, source } = calcAtlasColumns(header.tileCount, wedWidth);
  const rows = calcAtlasRows(header.tileCount, columns);
  const atlas = createAtlasBuffer(columns, rows);
  const tiles: PvrzTisTile[] = [];

  const dataReader = reader.fork(header.headerSize);

  for (let tileIdx = 0; tileIdx < header.tileCount; tileIdx = tileIdx + 1) {
    const page = dataReader.int(); // -1 = solid black
    const x = dataReader.uint();
    const y = dataReader.uint();

    const pvrzResourceName = page === -1 ? null : pvrzFileNameForPage(resourceName, page);
    tiles.push({
      index: tileIdx,
      page,
      x,
      y,
      pvrzResourceName,
    });

    let tileRgba: Buffer;
    if (page === -1 || !pvrzResourceName) {
      tileRgba = blackTile();
    }
    else {
      const image = pvrzRgbaIndex.get(pvrzResourceName)!;
      if (!image) throw new Error(`Missing PVRZ '${pvrzResourceName}' tile '${tileIdx}' for resource '${resourceName}'`);
      tileRgba = cropTile(image, x, y);
    }

    blitTileRgba(atlas, columns, tileIdx, tileRgba);
  }

  const imageName = `${resourceName}.png`;

  const tis: Tis = {
    resourceName,
    header,
    variant: 'pvrz',
    columns,
    rows,
    atlasWidthSource: source,
    imageName: imageName,
    tiles,
  };

  return {
    tis,
    png: encodeRgbaPng(columns * TILE_DIMENSION, rows * TILE_DIMENSION, atlas),
  };
};
