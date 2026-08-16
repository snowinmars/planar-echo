import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawBamV1FrameEntry } from './2.parseFrames.types.js';

type ParseFramesProps = Readonly<{
  reader: BufferReader;
  framesCount: number;
}>;

export const parseFrames = ({
  reader,
  framesCount,
}: ParseFramesProps): RawBamV1FrameEntry[] => {
  const frames: RawBamV1FrameEntry[] = [];

  for (let i = 0; i < framesCount; i++) {
    const width = reader.ushort();
    const height = reader.ushort();
    const centerX = reader.short();
    const centerY = reader.short();
    const data = reader.uint();

    frames.push({
      index: i,
      width,
      height,
      centerX,
      centerY,
      dataOffset: data & 0x7fffffff,
      compressed: (data & 0x80000000) === 0,
    });
  }
  return frames;
};
