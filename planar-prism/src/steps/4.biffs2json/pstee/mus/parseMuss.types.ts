import type { Maybe } from '@planar/shared';

export type RawMusSegment = Readonly<{
  entry: string;
  isSilence: boolean;
  next: Readonly<Maybe<{
    subfolder: Maybe<string>;
    entry: string;
  }>>;
  tag: Readonly<Maybe<{
    entry: string;
  }>>;
}>;
export type RawMus = Readonly<{
  resourceName: string;
  subfolder: string;
  count: number;
  segments: RawMusSegment[];
}>;
