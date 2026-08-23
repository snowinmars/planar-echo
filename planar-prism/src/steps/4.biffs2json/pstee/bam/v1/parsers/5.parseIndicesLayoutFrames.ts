import type { RawBamV1IndicesLayout } from '../parseBamV1.types.js';
import type { RawBamV1FrameEntry } from './2.parseFrames.types.js';

export const parseIndicesLayoutFrames = (frameEntries: RawBamV1FrameEntry[]): RawBamV1IndicesLayout['frames'] => {
  let byteOffset = 0;
  return frameEntries.map((frame, i) => {
    const byteLength = Math.max(0, frame.width) * Math.max(0, frame.height);
    const row = {
      index: i,
      width: frame.width,
      height: frame.height,
      byteOffset,
      byteLength,
    };
    byteOffset = byteOffset + byteLength;
    return row;
  });
};
