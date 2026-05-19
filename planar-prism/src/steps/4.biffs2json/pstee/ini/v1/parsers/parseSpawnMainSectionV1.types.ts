import type { Maybe } from '@planar/shared';

export type SpawnMainIniSection = Readonly<{
  enter: Maybe<string>;
  exit: Maybe<string>;
  events: Maybe<string>;
}>;
