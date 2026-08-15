import type { Maybe } from '@planar/shared';

export type RawBcsStream = Readonly<{
  eos: () => boolean;
  positionOf: () => number;
  skipWhitespaces: () => RawBcsStream;
  peek: () => string;
  peekToken: (s: string) => boolean;
  peekMatch: (regex: string) => Maybe<string>;
  skipByte: (andWhitespaces?: boolean) => RawBcsStream;
  skipToken: (s: string, andWhitespaces?: boolean) => boolean;
  getByte: (andWhitespaces?: boolean) => string;
  getMatch: (regex: string, andWhitespaces?: boolean) => Maybe<string>;
}>;
