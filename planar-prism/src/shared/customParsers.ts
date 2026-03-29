import { nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export const parseDecOrThrow = (s: Maybe<string>): number => {
  if (!s) throw new Error(`Cannot parse base 10 inteter from nothing`);

  const parsed = parseInt(s, 10);
  if (isNaN(parsed)) throw new Error(`Cannot parse base 10 inteter from '${s}'`);
  return parsed;
};

export const parseDecOrDefault = (s: Maybe<string>, defaultValue: number): number => {
  if (!s) return defaultValue;
  try {
    return parseDecOrThrow(s);
  }
  catch {
    return defaultValue;
  }
};

export const parseDecOrNothing = (s: Maybe<string>): Maybe<number> => {
  if (!s) return nothing();
  try {
    return parseDecOrThrow(s);
  }
  catch {
    return nothing();
  }
};
