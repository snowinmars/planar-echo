import { layoutHorizontalAtlas } from '../shared/buildAtlas.js';
import { parseHeader } from './parsers/1.parseHeader.js';
import { parseFrames } from './parsers/2.parseFrames.js';
import { parseCycles } from './parsers/3.parseCycles.js';
import { parseIndicesLayoutFrames } from './parsers/5.parseIndicesLayoutFrames.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { BamAtlasFrame } from '../shared/buildAtlas.js';
import type { RawBamV1, RawBamV1Frame } from './parseBamV1.types.js';
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

export const parseBamV1Json = ({
  reader,
  resourceName,
}: ParseBamV1Props): RawBamV1 => {
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

  const atlas = layoutHorizontalAtlas(frameEntries);

  const indicesLayoutFrames = parseIndicesLayoutFrames(frameEntries);

  return {
    resourceName,
    header,
    imageName: `${resourceName}.png`,
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
};
