import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawBamV2FrameEntry } from './2.parseEntries.types.js';

type ParseFramesProps = Readonly<{
  reader: BufferReader;
  framesCount: number;
}>;
export const parseFrames = ({
  reader,
  framesCount,
}: ParseFramesProps): RawBamV2FrameEntry[] => {
  const frames: RawBamV2FrameEntry[] = [];

  for (let i = 0; i < framesCount; i++) {
    frames.push({
      index: i,
      width: reader.ushort(),
      height: reader.ushort(),
      centerX: reader.short(),
      centerY: reader.short(),
      dataBlockIndex: reader.ushort(),
      dataBlockCount: reader.ushort(),
    });
  }

  return frames;
};
