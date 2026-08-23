export type BamV1FramePixels = Readonly<{
  width: number;
  height: number;
  dataOffset: number;
  compressed: boolean;
}>;

export type DecodedBamV1Frame = Readonly<{
  indices: Buffer;
  rgba: Buffer;
}>;

type DecodeBamV1FramesProps = Readonly<{
  src: Buffer;
  frames: readonly BamV1FramePixels[];
  palette: Buffer;
  rleIndex: number;
}>;

const decodeFrame = (
  src: Buffer,
  frame: BamV1FramePixels,
  palette: Buffer,
  rleIndex: number,
): DecodedBamV1Frame => {
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

export const decodeBamV1Frames = ({
  src,
  frames,
  palette,
  rleIndex,
}: DecodeBamV1FramesProps): DecodedBamV1Frame[] =>
  frames.map(frame => decodeFrame(src, frame, palette, rleIndex));

export const fixBamPalette = (src: Buffer): Buffer => {
  const palette = Buffer.alloc(256 * 4);
  src.copy(palette);

  for (let i = 0; i < 256; i++) {
    const a = palette[i * 4 + 3] ?? 0;
    if (a === 0) palette[i * 4 + 3] = 255;
  }

  return palette;
};
