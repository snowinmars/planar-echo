import type { Maybe } from '../maybe.js';

export type GhostMusSegment = Readonly<{
  entry: string;
  isSilence: boolean;
  next?: Maybe<Readonly<{
    subfolder: Maybe<string>;
    entry: string;
  }>>;
  tag?: Maybe<Readonly<{
    entry: string;
  }>>;
}>;

export type GhostMus = Readonly<{
  resourceName: string;
  subfolder: string;
  count: number;
  segments: GhostMusSegment[];
}>;
