export type RawBamV2DataBlock = Readonly<{
  index: number;
  page: number;
  pvrzResourceName: string;
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  targetX: number;
  targetY: number;
}>;
