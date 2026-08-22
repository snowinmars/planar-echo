import { parseHeader } from './parsers/1.parseHeader.js';
import { parseFrames } from './parsers/2.parseFrames.js';
import { parseCycles } from './parsers/3.parseCycles.js';
import { parsePalette } from './parsers/4.parsePalette.js';
import { decodeFrames } from './parsers/5.decodeFrames.js';
import { buildIndices } from './parsers/6.buildIndices.js';
import { buildHorizontalAtlas } from '../shared/buildAtlas.js';

import type { BamAtlasFrame } from '../shared/buildAtlas.js';
import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV1, RawBamV1Artifacts, RawBamV1Frame } from './parseBamV1.types.js';
import type { RawBamV1FrameEntry } from './parsers/2.parseFrames.types.js';

const joinFrames = (frame: RawBamV1FrameEntry, atlasFrame: BamAtlasFrame): RawBamV1Frame => {
  if (frame.width !== atlasFrame.width) throw new Error(`Do not want to override property 'width' between RawBamV1FrameEntry '${frame.width}' and BamAtlasFrame '${atlasFrame.width}'`);
  if (frame.height !== atlasFrame.height) throw new Error(`Do not want to override property 'height' between RawBamV1FrameEntry '${frame.height}' and BamAtlasFrame '${atlasFrame.height}'`);
  if (frame.centerX !== atlasFrame.centerX) throw new Error(`Do not want to override property 'centerX' between RawBamV1FrameEntry '${frame.centerX}' and BamAtlasFrame '${atlasFrame.centerX}'`);
  if (frame.centerY !== atlasFrame.centerY) throw new Error(`Do not want to override property 'centerY' between RawBamV1FrameEntry '${frame.centerY}' and BamAtlasFrame '${atlasFrame.centerY}'`);

  return {
    index: frame.index,
    width: frame.width,
    height: frame.height,
    centerX: frame.centerX,
    centerY: frame.centerY,
    dataOffset: frame.dataOffset,
    compressed: frame.compressed,
    atlasX: atlasFrame.atlasX,
    atlasY: atlasFrame.atlasY,
  };
};

type ParseBamV1Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseBamV1 = async ({
  reader,
  resourceName,
}: ParseBamV1Props): Promise<RawBamV1Artifacts> => {
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

  const atlas = await buildHorizontalAtlas(frameEntries.map((frame, i) => ({
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
    frames: frameEntries.map((frame, i) => joinFrames(frame, atlas.frames[i]!)),
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
    image: atlas.image,
    palette,
    indices,
  };
};
