import type { Direction } from '@planar/shared';

export type CreatureIniSpawnPoint = Readonly<{
  x: number;
  y: number;
  direction: Direction;
}>;
