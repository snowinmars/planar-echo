import { extendMap } from './13.parseAnimations.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreAnimationV10 } from './13.parseAnimations.types.js';

const parseAnimation = (reader: BufferReader): RawAreAnimationV10 => {
  const name = reader.nullTerminatedString(32);
  const x = reader.ushort();
  const y = reader.ushort();
  const presentedAt = reader.map.uint(extendMap.presentedAtFlags.parseFlags);
  const animationResref = reader.string(8);
  const bamSequenceNumber = reader.ushort();
  const bamFrameNumber = reader.ushort();
  const flags = reader.map.uint(extendMap.animationFlags.parseFlags);
  const height = reader.ushort();
  const transparency = reader.ushort();
  const startFrame = reader.ushort();
  const loopProbability = reader.ubyte();
  const skipCycles = reader.ubyte();
  const palette = reader.string(8);
  const animationWidth = reader.ushort();
  const animationHeight = reader.ushort();

  const rawAreAnimationV10: RawAreAnimationV10 = ({
    name,
    at: {
      x,
      y,
    },
    presentedAt,
    animationResref,
    bamSequenceNumber,
    bamFrameNumber,
    flags,
    height,
    transparency,
    startFrame,
    loopProbability,
    skipCycles,
    palette,
    animationWidth,
    animationHeight,
  });

  return rawAreAnimationV10;
};

type ParseAnimationsProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseAnimations = ({
  reader,
  count,
}: ParseAnimationsProps): RawAreAnimationV10[] => {
  const animations: RawAreAnimationV10[] = [];

  for (let i = 0; i < count; i++) animations.push(parseAnimation(reader));

  return animations;
};
