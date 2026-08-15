import type { Maybe } from '@planar/shared';

export type RawIniNamelessIniSection = Readonly<{
  destare: string;
  point: [number, number];
  state: number;
  partyPoint: Maybe<[number, number]>;
  partyArea: Maybe<string>;
}>;
