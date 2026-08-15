export type RawMosV1IndicesBlockLayout = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  byteOffset: number;
  byteLength: number;
}>;

export type RawMosV1BlockMeta = Readonly<{
  index: number;
  col: number;
  row: number;
  width: number;
  height: number;
  paletteByteOffset: number;
  lookupOffset: number;
  pixelDataOffset: number;
}>;
