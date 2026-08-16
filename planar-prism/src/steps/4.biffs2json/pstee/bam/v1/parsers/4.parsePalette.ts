export const parsePalette = (src: Buffer): Buffer => {
  const palette = Buffer.alloc(256 * 4);
  src.copy(palette);

  for (let i = 0; i < 256; i++) {
    const a = palette[i * 4 + 3] ?? 0;
    if (a === 0) palette[i * 4 + 3] = 255;
  }

  return palette;
};
