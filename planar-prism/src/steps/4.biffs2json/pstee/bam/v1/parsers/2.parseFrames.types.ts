export type RawBamV1FrameEntry = Readonly<{
  index: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  dataOffset: number;
  compressed: boolean;
}>;
