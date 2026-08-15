import type { Maybe } from '@planar/shared';

export type RawIniSpawnMainIniSection = Readonly<{
  enter: Maybe<string>;
  exit: Maybe<string>;
  events: Maybe<string>;
}>;
