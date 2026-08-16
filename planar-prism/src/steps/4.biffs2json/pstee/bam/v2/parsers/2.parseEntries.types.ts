export type RawBamV2FrameEntry = Readonly<{
  index: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  dataBlockIndex: number;
  dataBlockCount: number;
}>;
