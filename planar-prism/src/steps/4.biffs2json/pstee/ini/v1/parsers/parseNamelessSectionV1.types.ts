import type { Maybe } from '@planar/shared';

export type NamelessIniSection = Readonly<{
  destare: string;
  point: [number, number];
  state: number;
  partyPoint: Maybe<[number, number]>;
  partyArea: Maybe<string>;
}>;
