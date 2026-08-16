import type { RawBamV1FrameEntry } from './2.parseFrames.types.js';

export type RawBamV1DecodedFrame = Readonly<{
  indices: Buffer;
  rgba: Buffer;
}>;

type DecodeFramesProps = Readonly<{
  src: Buffer;
  frames: RawBamV1FrameEntry[];
  palette: Buffer;
  rleIndex: number;
}>;

const decodeFrame = (
  src: Buffer,
  frame: RawBamV1FrameEntry,
  palette: Buffer,
  rleIndex: number,
): RawBamV1DecodedFrame => {
  const pixelCount = frame.width * frame.height;
  const indices = Buffer.alloc(pixelCount, 0);
  const rgba = Buffer.alloc(pixelCount * 4, 0);

  if (pixelCount === 0) return { indices, rgba };

  let srcOfs = frame.dataOffset;
  let dst = 0;
  let run = 0;
  let pixel = 0;

  while (dst < pixelCount && srcOfs < src.length) {
    if (run > 0) {
      run = run - 1;
    }
    else {
      pixel = src[srcOfs] ?? 0;
      srcOfs = srcOfs + 1;

      if (frame.compressed && pixel === rleIndex) {
        run = src[srcOfs] ?? 0;
        srcOfs = srcOfs + 1;
      }
    }

    indices[dst] = pixel;
    const pal = pixel * 4;
    const out = dst * 4;

    if (pixel === rleIndex) {
      rgba[out] = 0;
      rgba[out + 1] = 0;
      rgba[out + 2] = 0;
      rgba[out + 3] = 0;
    }
    else {
      rgba[out] = palette[pal + 2] ?? 0;
      rgba[out + 1] = palette[pal + 1] ?? 0;
      rgba[out + 2] = palette[pal] ?? 0;
      rgba[out + 3] = palette[pal + 3] ?? 255;
    }
    dst = dst + 1;
  }

  return { indices, rgba };
};

export const decodeFrames = ({
  src,
  frames,
  palette,
  rleIndex,
}: DecodeFramesProps): RawBamV1DecodedFrame[] => {
  return frames.map(frame => decodeFrame(src, frame, palette, rleIndex));
};
