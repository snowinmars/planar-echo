export type Rectangle = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type RgbaImage = Readonly<{
  width: number;
  height: number;
  data: Buffer;
}>;
