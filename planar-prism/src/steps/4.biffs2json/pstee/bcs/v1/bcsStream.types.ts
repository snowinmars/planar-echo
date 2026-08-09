import type { Maybe } from '@planar/shared';

export type BcsStream = Readonly<{
  eos: () => boolean;
  positionOf: () => number;
  skipWhitespaces: () => BcsStream;
  peek: () => string;
  peekToken: (s: string) => boolean;
  peekMatch: (regex: string) => Maybe<string>;
  skipByte: (andWhitespaces?: boolean) => BcsStream;
  skipToken: (s: string, andWhitespaces?: boolean) => boolean;
  getByte: (andWhitespaces?: boolean) => string;
  getMatch: (regex: string, andWhitespaces?: boolean) => Maybe<string>;
}>;
