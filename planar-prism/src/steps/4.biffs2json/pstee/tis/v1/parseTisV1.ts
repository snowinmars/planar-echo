import { findWedForTis } from '../../wed/index.js';
import { PALETTE_TILE_SIZE, PVRZ_TILE_SIZE } from '../shared/tisCommon.js';
import { parsePaletteTis } from './palette/parsePaletteTis.js';
import { parsePvrzTis } from './pvrz/parsePvrzTis.js';
import { parseHeader } from './1.parseHeader.js';

import type { RawWed } from '../../wed/index.js';
import type { RawPvrRgbaImage } from '../../pvrz/decode/index.js';
import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawTisArtifacts } from './parseTisV1.types.js';

const knownTisWithoutWed = [
  'fire01.tis',
  'fire02.tis',
];

type ParseTisV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
  wedIndex: Map<string, RawWed>;
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>;
}>;
export const parseTisV1 = async ({
  reader,
  resourceName,
  wedIndex,
  pvrzRgbaIndex,
}: ParseTisV1Props): Promise<RawTisArtifacts> => {
  const header = parseHeader(reader, resourceName);

  const wed = findWedForTis(wedIndex, resourceName, header.tileCount);
  const wedWidth = wed?.overlays[0]?.width;
  if (!wed) {
    const isKnownTis = knownTisWithoutWed.includes(resourceName);
    if (!isKnownTis) throw new Error(`No wed found for tis '${resourceName}'`);
  }

  switch (header.tileSize) {
    case PALETTE_TILE_SIZE: {
      const parsed = await parsePaletteTis({
        reader,
        resourceName,
        header,
        wedWidth,
      });

      return {
        tis: parsed.tis,
        image: parsed.image,
        palette: parsed.palette,
        indices: parsed.indices,
      };
    }
    case PVRZ_TILE_SIZE: {
      const parsed = await parsePvrzTis({
        reader,
        resourceName,
        header,
        wedWidth,
        pvrzRgbaIndex,
      });

      return {
        tis: parsed.tis,
        image: parsed.image,
      };
    }
    default: throw new Error(`Unsupported TIS tile size '${header.tileSize}' in '${resourceName}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};
