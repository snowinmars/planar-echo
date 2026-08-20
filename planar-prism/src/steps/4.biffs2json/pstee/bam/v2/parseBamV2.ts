import { parseHeader } from './parsers/1.parseHeader.js';
import { parseFrames } from './parsers/2.parseEntries.js';
import { parseCycles } from './parsers/3.parseCycles.js';
import { parseBlocks } from './parsers/4.parseBlocks.js';
import { renderFrames } from './parsers/5.renderFrames.js';
import { buildHorizontalAtlas, type BamAtlasFrame } from '../shared/buildAtlas.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawPvrRgbaImage } from '../../pvrz/decode/index.js';
import type { RawBamV2, RawBamV2Artifacts, RawBamV2Frame } from './parseBamV2.types.js';
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

type ParseBamV2Props = Readonly<{
  reader: BufferReader;
  resourceName: string;
  pvrzRgbaIndex: Map<string, RawPvrRgbaImage>;
}>;
export const parseBamV2 = ({
  reader,
  resourceName,
  pvrzRgbaIndex,
}: ParseBamV2Props): RawBamV2Artifacts => {
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

  const rgbaFrames = renderFrames({
    resourceName,
    frames: frameEntries,
    blocks,
    pvrzRgbaIndex,
  });

  const atlas = buildHorizontalAtlas(frameEntries.map((frame, i) => ({
    width: frame.width,
    height: frame.height,
    centerX: frame.centerX,
    centerY: frame.centerY,
    rgba: frame.width > 0 && frame.height > 0 ? rgbaFrames[i] : undefined,
  })));

  const imageName = `${resourceName}.png`;
  const bam: RawBamV2 = {
    resourceName,
    header,
    imageName,
    atlasWidth: atlas.atlasWidth,
    atlasHeight: atlas.atlasHeight,
    frames: frameEntries.map((frame, i) => joinFrames(frame, atlas.frames[i]!)),
    cycles,
    blocks,
  };

  return {
    bam,
    png: atlas.png,
  };
};
