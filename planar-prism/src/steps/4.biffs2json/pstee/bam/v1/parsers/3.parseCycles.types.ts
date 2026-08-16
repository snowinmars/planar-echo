export type RawBamV1CycleEntry = Readonly<{
  index: number;
  framesCount: number;
  firstLookup: number;
  frameIndices: number[];
}>;
