import sharp from 'sharp';

export const encodeRgbaPng = async (width: number, height: number, canvas: Buffer): Promise<Buffer> => {
  if (width <= 0 || height <= 0) throw new Error(`encodeRgbaPng: width and height must be > 0, got ${width}x${height}`);

  return sharp(canvas, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 2 })
    .toBuffer();
};
