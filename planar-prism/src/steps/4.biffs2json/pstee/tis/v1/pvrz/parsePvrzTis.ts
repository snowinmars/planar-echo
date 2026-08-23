import { nothing } from '@planar/shared';
import {
  calcAtlasColumns,
  calcAtlasRows,
  PVRZ_TILE_SIZE,
  pvrzFileNameForPage,
} from '../../shared/tisCommon.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawTisHeader } from '../1.parseHeader.types.js';
import type { RawTisPvrz, RawTisTile } from './parsePvrzTis.types.js';

type ParsePvrzTisProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  header: RawTisHeader;
  wedWidth: number | undefined;
}>;
export const parsePvrzTisJson = ({
  reader,
  resourceName,
  header,
  wedWidth,
}: ParsePvrzTisProps): RawTisPvrz => {
  if (header.tileSize !== PVRZ_TILE_SIZE) throw new Error(`Expected pvrz tile size '${PVRZ_TILE_SIZE}', got '${header.tileSize}' for resource '${resourceName}'`);

  const { columns, source } = calcAtlasColumns(header.tileCount, wedWidth);
  const rows = calcAtlasRows(header.tileCount, columns);
  const tiles: RawTisTile[] = [];

  const dataReader = reader.fork(header.headerSize);

  for (let tileIdx = 0; tileIdx < header.tileCount; tileIdx = tileIdx + 1) {
    const page = dataReader.int();
    const x = dataReader.uint();
    const y = dataReader.uint();

    const pvrzResourceName = page === -1 ? nothing() : pvrzFileNameForPage(resourceName, page);
    tiles.push({
      index: tileIdx,
      page,
      x,
      y,
      pvrzResourceName,
    });
  }

  return {
    resourceName,
    header,
    variant: 'pvrz',
    columns,
    rows,
    atlasWidthSource: source,
    imageName: `${resourceName}.png`,
    tiles,
  };
};
