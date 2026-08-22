import type { Direction, Point } from '@planar/shared';

export type RawAreEntranceV10 = Readonly<{
  name: string;
  at: Point;
  direction: Direction;
}>;
