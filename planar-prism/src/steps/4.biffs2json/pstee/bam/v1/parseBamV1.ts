import { parseHeader } from './parsers/1.parseHeader.js';
import { parseFrames } from './parsers/2.parseFrames.js';
import { parseCycles } from './parsers/3.parseCycles.js';
import { parsePalette } from './parsers/4.parsePalette.js';
import { decodeFrames } from './parsers/5.decodeFrames.js';
import { buildHorizontalAtlas } from '../shared/buildAtlas.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV1, RawBamV1Artifacts } from './parseBamV1.types.js';
import { buildIndices } from './parsers/6.buildIndices.js';

type ParseBamV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;

export const parseBamV1 = ({
  reader,
  resourceName,
}: ParseBamV1Props): RawBamV1Artifacts => {
  const header = parseHeader(reader, resourceName);

  const frameEntries = parseFrames({
    reader: reader.fork(header.framesOffset),
    framesCount: header.framesCount,
  });

  const cycles = parseCycles({
    cycleReader: reader.fork(header.framesOffset + header.framesCount * 12),
    lookupReader: reader.fork(header.lookupOffset),
    cyclesCount: header.cyclesCount,
  });

  const palette = parsePalette(reader.blob(header.paletteOffset, header.paletteOffset + 256 * 4));

  const decoded = decodeFrames({
    src: reader.buffer,
    frames: frameEntries,
    palette,
    rleIndex: header.rleIndex,
  });

  const atlas = buildHorizontalAtlas(frameEntries.map((frame, i) => ({
    width: frame.width,
    height: frame.height,
    centerX: frame.centerX,
    centerY: frame.centerY,
    rgba: frame.width > 0 && frame.height > 0 ? decoded[i]!.rgba : undefined,
  })));

  const {
    indices,
    indicesLayoutFrames,
  } = buildIndices({
    frameEntries,
    decoded,
  });

  const imageName = `${resourceName}.png`;
  const bam: RawBamV1 = {
    resourceName,
    header,
    imageName,
    atlasWidth: atlas.atlasWidth,
    atlasHeight: atlas.atlasHeight,
    frames: frameEntries.map((frame, i) => ({
      ...frame,
      ...atlas.frames[i]!,
    })),
    cycles,
    paletteLayout: {
      format: 'bgra',
      entryBytes: 4,
      entries: 256,
      transparentIndex: header.rleIndex,
    },
    indicesLayout: {
      format: 'uint8-index',
      frames: indicesLayoutFrames,
    },
  };

  return {
    bam,
    png: atlas.png,
    palette,
    indices,
  };
};
