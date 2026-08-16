import type { RawBamV1 } from '../parseBamV1.types.js';
import type { RawBamV1FrameEntry } from './2.parseFrames.types.js';
import type { RawBamV1DecodedFrame } from './5.decodeFrames.js';

type BuildIndicesProps = Readonly<{
  frameEntries: RawBamV1FrameEntry[];
  decoded: RawBamV1DecodedFrame[];
}>;
type BuildIndicesResponse = Readonly<{
  indices: Buffer;
  indicesLayoutFrames: RawBamV1['indicesLayout']['frames'];
}>;
export const buildIndices = ({
  frameEntries,
  decoded,
}: BuildIndicesProps): BuildIndicesResponse => {
  const indicesChunks: Buffer[] = [];
  const indicesLayoutFrames: RawBamV1['indicesLayout']['frames'] = [];
  let byteOffset = 0;
  for (let i = 0; i < frameEntries.length; i++) {
    const frame = frameEntries[i]!;
    const chunk = decoded[i]!.indices;

    indicesLayoutFrames.push({
      index: i,
      width: frame.width,
      height: frame.height,
      byteOffset,
      byteLength: chunk.length,
    });

    indicesChunks.push(chunk);
    byteOffset = byteOffset + chunk.length;
  }

  const indices = Buffer.concat(indicesChunks);

  return {
    indices,
    indicesLayoutFrames,
  };
};
