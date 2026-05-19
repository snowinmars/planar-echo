import type { Maybe } from '@planar/shared';

export type SoundsIniSection = Readonly<{
  hitsound: Maybe<string[]>;
  hitframe: Maybe<number>;
  dfbsound: Maybe<string>;
  dfbframe: Maybe<number>;
  at1Sound: Maybe<string>;
  at1frame: Maybe<number>;
  at2Sound: Maybe<string>;
  at2frame: Maybe<number>;
  cf1Sound: Maybe<string>;
  cf1frame: Maybe<number>;
}>;
