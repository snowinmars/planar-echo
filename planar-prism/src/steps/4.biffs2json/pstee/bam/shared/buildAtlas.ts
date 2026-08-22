import { encodeRgbaPng } from '../../tis/shared/writePng.js';

export type BamAtlasFrameInput = Readonly<{
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  rgba?: Buffer | undefined;
}>;

export type BamAtlasFrame = Readonly<{
  atlasX: number;
  atlasY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}>;

export type BamAtlas = Readonly<{
  image: Buffer;
  frames: BamAtlasFrame[];
  atlasWidth: number;
  atlasHeight: number;
}>;

type BuildImageProps = Readonly<{
  width: number;
  height: number;
  frames: BamAtlasFrameInput[];
  placed: BamAtlasFrame[];
}>;
const buildImage = ({
  width,
  height,
  frames,
  placed,
}: BuildImageProps): Buffer => {
  const canvas = Buffer.alloc(width * height * 4, 0);
  for (let i = 0; i < frames.length; i++) {
    const src = frames[i]!;
    const dst = placed[i]!;

    if (dst.atlasX < 0 || !src.rgba) continue;

    for (let row = 0; row < src.height; row++) {
      const srcStart = row * src.width * 4;
      const dstStart = (row * width + dst.atlasX) * 4;
      src.rgba.copy(canvas, dstStart, srcStart, srcStart + src.width * 4);
    }
  }

  return canvas;
};

export const buildHorizontalAtlas = async (frames: BamAtlasFrameInput[]): Promise<BamAtlas> => {
  const placed: BamAtlasFrame[] = [];
  let atlasWidth = 0;
  let atlasHeight = 0;

  for (const frame of frames) {
    if (frame.width <= 0 || frame.height <= 0 || !frame.rgba) {
      placed.push({
        atlasX: -1,
        atlasY: -1,
        width: frame.width,
        height: frame.height,
        centerX: frame.centerX,
        centerY: frame.centerY,
      });

      continue;
    }

    placed.push({
      atlasX: atlasWidth,
      atlasY: 0,
      width: frame.width,
      height: frame.height,
      centerX: frame.centerX,
      centerY: frame.centerY,
    });

    atlasWidth = atlasWidth + frame.width;
    if (frame.height > atlasHeight) atlasHeight = frame.height;
  }

  if (atlasWidth <= 0 || atlasHeight <= 0) {
    return {
      image: await encodeRgbaPng(1, 1, Buffer.alloc(4, 0)),
      frames: placed,
      atlasWidth: 1,
      atlasHeight: 1,
    };
  }

  return {
    image: await encodeRgbaPng(
      atlasWidth,
      atlasHeight,
      buildImage({
        width: atlasWidth,
        height: atlasHeight,
        frames,
        placed,
      }),
    ),
    frames: placed,
    atlasWidth,
    atlasHeight,
  };
};
