import { isNothing, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

import type { RawBcsStream } from './bcsStream.types.js';

const WHITESPACES = ' \t\r\n\f';

export const createBcsStream = (data: string): RawBcsStream => {
  let position = 0;

  const eos = (): boolean => position >= data.length;

  const positionOf = (): number => position;

  const skipWhitespaces = (): RawBcsStream => {
    while (!eos() && WHITESPACES.includes(data[position]!)) position++;

    return stream;
  };

  const peek = (): string => eos() ? '\0' : data[position]!;

  const peekToken = (s: string): boolean => {
    const peekingForNothing = !s.length;
    if (peekingForNothing) return true;

    const peekingOutOfScope = position + s.length > data.length;
    if (peekingOutOfScope) return false;

    return data.startsWith(s, position);
  };

  const peekMatch = (regex: string): Maybe<string> => {
    const peekingForNothing = !regex.length;
    if (peekingForNothing) return nothing();

    const pattern = new RegExp(regex, 's');
    const slice = data.slice(position);
    const m = pattern.exec(slice);

    const miss = !m || m.index !== 0;
    if (miss) return nothing();

    return m[0];
  };

  const skipByte = (andWhitespaces = true): RawBcsStream => {
    if (position < data.length) position++;
    return andWhitespaces ? skipWhitespaces() : stream;
  };

  const skipToken = (s: string, andWhitespaces = true): boolean => {
    const skipingForNothing = !s.length;
    if (skipingForNothing) return true;

    if (!peekToken(s)) return false;

    position += s.length;
    if (andWhitespaces) skipWhitespaces();
    return true;
  };

  const getByte = (andWhitespaces = true): string => {
    const ch = peek();
    if (position < data.length) position++;

    if (andWhitespaces) skipWhitespaces();

    return ch;
  };

  const getMatch = (regex: string, andWhitespaces = true): Maybe<string> => {
    const s = peekMatch(regex);

    if (isNothing(s)) return s;

    position += s.length;
    if (andWhitespaces) skipWhitespaces();
    return s;
  };

  const stream: RawBcsStream = {
    eos,
    positionOf,
    skipWhitespaces,
    peek,
    peekToken,
    peekMatch,
    skipByte,
    skipToken,
    getByte,
    getMatch,
  };

  return stream;
};
