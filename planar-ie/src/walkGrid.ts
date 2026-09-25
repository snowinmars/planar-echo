export type WalkGrid = Readonly<{
  cellWidth: number;
  cellHeight: number;
  colsCount: number;
  rowsCount: number;
  grid: Uint8Array;
}>;

export const UNPASSABLE_WALK = 0;
export const PASSABLE_WALK = 1;
