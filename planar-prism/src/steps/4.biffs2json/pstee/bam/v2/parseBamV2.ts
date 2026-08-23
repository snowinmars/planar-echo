import { parseHeader } from './parsers/1.parseHeader.js';
import { parseFrames } from './parsers/2.parseEntries.js';
import { parseCycles } from './parsers/3.parseCycles.js';
import { parseBlocks } from './parsers/4.parseBlocks.js';
import { layoutHorizontalAtlas, type BamAtlasFrame } from '../shared/buildAtlas.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV2, RawBamV2Frame } from './parseBamV2.types.js';
import type { RawBamV2FrameEntry } from './parsers/2.parseEntries.types.js';

const joinFrames = (frame: RawBamV2FrameEntry, atlasFrame: BamAtlasFrame): RawBamV2Frame => {
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
    dataBlockCount: frame.dataBlockCount,
    dataBlockIndex: frame.dataBlockIndex,
    atlasX: atlasFrame.atlasX,
    atlasY: atlasFrame.atlasY,
  };
};

type ParseBamV2JsonProps = Readonly<{
  reader: BufferReader;
  resourceName: string;
}>;
export const parseBamV2Json = ({
  reader,
  resourceName,
}: ParseBamV2JsonProps): RawBamV2 => {
  const header = parseHeader(reader, resourceName);
  const frameEntries = parseFrames({
    reader: reader.fork(header.framesOffset),
    framesCount: header.framesCount,
  });
  const cycles = parseCycles({
    reader: reader.fork(header.cyclesOffset),
    cyclesCount: header.cyclesCount,
  });
  const blocks = parseBlocks({
    reader: reader.fork(header.blocksOffset),
    resourceName,
    dataBlockCount: header.dataBlockCount,
  });
  const atlas = layoutHorizontalAtlas(frameEntries);
  return {
    resourceName,
    header,
    imageName: `${resourceName}.png`,
    atlasWidth: atlas.atlasWidth,
    atlasHeight: atlas.atlasHeight,
    frames: frameEntries.map((frame, i) => joinFrames(frame, atlas.frames[i]!)),
    cycles,
    blocks,
  };
};
