export type BamAtlasFrame = Readonly<{
  atlasX: number;
  atlasY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}>;

export const layoutHorizontalAtlas = (frames: Readonly<{
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}>[]): Readonly<{
  frames: BamAtlasFrame[];
  atlasWidth: number;
  atlasHeight: number;
}> => {
  const placed: BamAtlasFrame[] = [];
  let atlasWidth = 0;
  let atlasHeight = 0;

  for (const frame of frames) {
    if (frame.width <= 0 || frame.height <= 0) {
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
      frames: placed,
      atlasWidth: 1,
      atlasHeight: 1,
    };
  }

  return {
    frames: placed,
    atlasWidth,
    atlasHeight,
  };
};
