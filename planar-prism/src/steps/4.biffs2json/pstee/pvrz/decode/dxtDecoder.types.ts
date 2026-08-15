export type RawPvrRectangle = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type RawPvrRgbaImage = Readonly<{
  width: number;
  height: number;
  data: Buffer;
}>;
