import type { Direction } from './parseDirectionV1.types.js';

export type CreatureIniSpawnPoint = Readonly<{
  x: number;
  y: number;
  direction: Direction;
}>;
