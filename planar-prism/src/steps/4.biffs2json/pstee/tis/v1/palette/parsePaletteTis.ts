import { calcAtlasColumns, calcAtlasRows, PALETTE_TILE_SIZE } from '../../shared/tisCommon.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawTisHeader } from '../1.parseHeader.types.js';
import type { RawTisPalette } from './parsePaletteTis.types.js';

type ParsePaletteTisProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  header: RawTisHeader;
  wedWidth: number | undefined;
}>;
export const parsePaletteTisJson = ({
  resourceName,
  header,
  wedWidth,
}: ParsePaletteTisProps): RawTisPalette => {
  if (header.tileSize !== PALETTE_TILE_SIZE) throw new Error(`Expected palette tile size '${PALETTE_TILE_SIZE}', got '${header.tileSize}' for resource '${resourceName}'`);

  const { columns, source } = calcAtlasColumns(header.tileCount, wedWidth);
  const rows = calcAtlasRows(header.tileCount, columns);

  const tiles = Array.from({ length: header.tileCount }, (_, tileIdx) => ({ index: tileIdx }));

  return {
    resourceName,
    header,
    variant: 'palette',
    columns,
    rows,
    atlasWidthSource: source,
    imageName: `${resourceName}.png`,
    paletteName: `${resourceName}.palette`,
    indicesName: `${resourceName}.indices`,
    tiles,
  };
};
