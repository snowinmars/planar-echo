import { findWedForTis } from '../../wed/index.js';
import { PALETTE_TILE_SIZE, PVRZ_TILE_SIZE } from '../shared/tisCommon.js';
import { parseHeader } from './1.parseHeader.js';
import { parsePaletteTisJson } from './palette/parsePaletteTis.js';
import { parsePvrzTisJson } from './pvrz/parsePvrzTis.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawWed } from '../../wed/index.js';
import type { RawTis } from '../parseTiss.types.js';

const knownTisWithoutWed = [
  'fire01.tis',
  'fire02.tis',
];

type ParseTisV1JsonProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
  wedIndex: Map<string, RawWed>;
}>;
export const parseTisV1Json = ({
  reader,
  resourceName,
  wedIndex,
}: ParseTisV1JsonProps): RawTis => {
  const header = parseHeader(reader, resourceName);

  const wed = findWedForTis(wedIndex, resourceName, header.tileCount);
  const wedWidth = wed?.overlays[0]?.width;
  if (!wed) {
    const isKnownTis = knownTisWithoutWed.includes(resourceName);
    if (!isKnownTis) throw new Error(`No wed found for tis '${resourceName}'`);
  }

  switch (header.tileSize) {
    case PALETTE_TILE_SIZE:
      return parsePaletteTisJson({
        reader,
        resourceName,
        header,
        wedWidth,
      });
    case PVRZ_TILE_SIZE:
      return parsePvrzTisJson({
        reader,
        resourceName,
        header,
        wedWidth,
      });
    default: throw new Error(`Unsupported TIS tile size '${header.tileSize}' in '${resourceName}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};
